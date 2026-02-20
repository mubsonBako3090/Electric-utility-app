import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Bill from '@/models/Bill';
import EnergyReading from '@/models/EnergyReading';
import Outage from '@/models/Outage';

export async function GET(request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get customer profile
    const customer = await Customer.findOne({ userId: session.id });
    
    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get current bill
    const currentBill = await Bill.findOne({
      customerId: customer._id,
      status: { $in: ['generated', 'sent'] }
    }).sort({ createdAt: -1 });

    // Get recent bills
    const recentBills = await Bill.find({ customerId: customer._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get energy readings for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const readings = await EnergyReading.find({
      customerId: customer._id,
      readingDate: { $gte: thirtyDaysAgo }
    }).sort({ readingDate: 1 });

    // Calculate average daily usage
    let avgDaily = 0;
    if (readings.length > 1) {
      const totalConsumption = readings.reduce((sum, reading, index) => {
        if (index === 0) return sum;
        return sum + (reading.readingValue - readings[index - 1].readingValue);
      }, 0);
      avgDaily = (totalConsumption / 30).toFixed(1);
    }

    // Get recent outages
    const outages = await Outage.find({
      customerId: customer._id,
      reportedAt: { $gte: thirtyDaysAgo }
    }).countDocuments();

    // Format recent bills
    const formattedBills = recentBills.map(bill => ({
      id: bill._id,
      period: `${bill.billingPeriod.from.toLocaleDateString()} - ${bill.billingPeriod.to.toLocaleDateString()}`,
      amount: bill.totalAmount,
      dueDate: bill.dueDate.toLocaleDateString(),
      status: bill.status,
    }));

    return NextResponse.json({
      name: session.name,
      customerId: customer.customerId,
      currentBill: currentBill?.totalAmount || 0,
      unitsConsumed: readings[readings.length - 1]?.readingValue - readings[0]?.readingValue || 0,
      avgDaily,
      outages,
      recentBills: formattedBills,
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
      }
