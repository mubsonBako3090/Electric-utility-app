import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import EnergyReading from '@/models/EnergyReading';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week';

    await connectDB();

    // Get customer
    const customer = await Customer.findOne({ userId: session.id });
    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Fetch readings
    const readings = await EnergyReading.find({
      customerId: customer._id,
      readingDate: { $gte: startDate, $lte: endDate }
    }).sort({ readingDate: 1 });

    // Process data based on range
    let processedData = [];
    
    if (range === 'day') {
      // Group by hour
      processedData = processHourlyData(readings);
    } else if (range === 'week') {
      // Group by day
      processedData = processDailyData(readings);
    } else if (range === 'month') {
      // Group by week
      processedData = processWeeklyData(readings);
    } else {
      // Group by month
      processedData = processMonthlyData(readings);
    }

    return NextResponse.json({
      range,
      data: processedData,
      total: processedData.reduce((sum, item) => sum + item.usage, 0),
      average: processedData.reduce((sum, item) => sum + item.usage, 0) / processedData.length,
    });
  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

function processHourlyData(readings) {
  // Implementation for hourly grouping
  return readings.map(r => ({
    hour: new Date(r.readingDate).getHours() + ':00',
    usage: r.consumption || 0,
    cost: (r.consumption || 0) * 5, // ₹5 per unit example
  }));
}

function processDailyData(readings) {
  // Implementation for daily grouping
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return readings.map(r => ({
    day: days[new Date(r.readingDate).getDay()],
    usage: r.consumption || 0,
    cost: (r.consumption || 0) * 5,
  }));
}

function processWeeklyData(readings) {
  // Implementation for weekly grouping
  return readings.map((r, i) => ({
    week: `Week ${i + 1}`,
    usage: r.consumption || 0,
    cost: (r.consumption || 0) * 5,
  }));
}

function processMonthlyData(readings) {
  // Implementation for monthly grouping
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return readings.map(r => ({
    month: months[new Date(r.readingDate).getMonth()],
    usage: r.consumption || 0,
    cost: (r.consumption || 0) * 5,
  }));
                              }
