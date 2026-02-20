import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';
import Feeder from '@/models/Feeder';
import Bill from '@/models/Bill';
import Outage from '@/models/Outage';
import VerificationReport from '@/models/VerificationReport';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get statistics
    const totalCustomers = await Customer.countDocuments();
    const activeFeeders = await Feeder.countDocuments({ status: 'active' });
    const activeOutages = await Outage.countDocuments({
      status: { $in: ['reported', 'verified', 'assigned', 'in_progress'] }
    });
    const pendingVerifications = await VerificationReport.countDocuments({
      status: 'pending'
    });

    // Calculate monthly revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const bills = await Bill.find({
      createdAt: { $gte: startOfMonth },
      status: 'paid'
    });

    const monthlyRevenue = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    // Calculate collection efficiency
    const totalBillsThisMonth = await Bill.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const paidBillsThisMonth = bills.length;
    const collectionEfficiency = totalBillsThisMonth > 0
      ? Math.round((paidBillsThisMonth / totalBillsThisMonth) * 100)
      : 100;

    // Generate chart data (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dailyBills = await Bill.find({
        createdAt: { $gte: date, $lt: nextDate },
        status: 'paid'
      });

      const revenue = dailyBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

      chartData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: revenue / 1000, // in thousands
      });
    }

    // Get outage distribution
    const outageByArea = await Outage.aggregate([
      {
        $match: {
          status: { $in: ['reported', 'verified', 'assigned', 'in_progress'] }
        }
      },
      {
        $group: {
          _id: '$location.area',
          count: { $sum: 1 }
        }
      },
      {
        $limit: 4
      }
    ]);

    const outageData = outageByArea.map(item => ({
      name: item._id || 'Unknown',
      value: item.count
    }));

    // Get recent activities
    const recentOutages = await Outage.find()
      .sort({ reportedAt: -1 })
      .limit(3)
      .populate('reportedBy', 'name');

    const recentPayments = await Bill.find({ status: 'paid' })
      .sort({ paymentDate: -1 })
      .limit(3)
      .populate('customerId');

    const activities = [];

    recentOutages.forEach(outage => {
      activities.push({
        type: 'outage',
        message: `Outage reported in ${outage.location?.area || 'Unknown area'}`,
        time: timeAgo(outage.reportedAt),
      });
    });

    recentPayments.forEach(payment => {
      activities.push({
        type: 'payment',
        message: `Payment received: ₹${payment.totalAmount}`,
        time: timeAgo(payment.paymentDate),
      });
    });

    // Sort by time
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    return NextResponse.json({
      stats: {
        totalCustomers,
        activeFeeders,
        monthlyRevenue,
        activeOutages,
        pendingVerifications,
        collectionEfficiency,
      },
      chartData,
      outageData: outageData.length ? outageData : [
        { name: 'North', value: 3 },
        { name: 'South', value: 5 },
        { name: 'East', value: 2 },
        { name: 'West', value: 4 },
      ],
      activities: activities.slice(0, 5),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
  }
