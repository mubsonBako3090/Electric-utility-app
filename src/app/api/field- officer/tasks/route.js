import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import EnergyReading from '@/models/EnergyReading';
import Outage from '@/models/Outage';
import VerificationReport from '@/models/VerificationReport';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'field-officer') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const officer = await User.findById(session.id);
    if (!officer) {
      return NextResponse.json(
        { message: 'Officer not found' },
        { status: 404 }
      );
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count pending readings
    const pendingReadings = await EnergyReading.countDocuments({
      verifiedBy: null,
      readingDate: { $gte: today, $lt: tomorrow },
    });

    // Count assigned outages
    const assignedOutages = await Outage.countDocuments({
      assignedOfficer: session.id,
      status: { $in: ['assigned', 'in_progress'] },
    });

    // Count pending verifications
    const verifications = await VerificationReport.countDocuments({
      assignedOfficer: session.id,
      status: 'pending',
    });

    // Count completed tasks today
    const completedReadings = await EnergyReading.countDocuments({
      verifiedBy: session.id,
      readingDate: { $gte: today, $lt: tomorrow },
    });

    const completedOutages = await Outage.countDocuments({
      assignedOfficer: session.id,
      status: 'resolved',
      resolvedAt: { $gte: today, $lt: tomorrow },
    });

    const completedToday = completedReadings + completedOutages;

    // Get today's tasks
    const readings = await EnergyReading.find({
      verifiedBy: null,
      readingDate: { $gte: today, $lt: tomorrow },
    })
      .populate('customerId')
      .limit(5);

    const outages = await Outage.find({
      assignedOfficer: session.id,
      status: { $in: ['assigned', 'in_progress'] },
    })
      .limit(5);

    const myTasks = [];

    readings.forEach(reading => {
      myTasks.push({
        id: reading._id,
        type: 'reading',
        title: `Meter Reading - ${reading.customerId?.customerId}`,
        location: reading.customerId?.address?.area || 'Unknown',
        time: new Date(reading.readingDate).toLocaleTimeString(),
        actionUrl: `/dashboard/field-officer/readings/${reading._id}`,
      });
    });

    outages.forEach(outage => {
      myTasks.push({
        id: outage._id,
        type: 'outage',
        title: `Outage: ${outage.type}`,
        location: outage.location?.area || 'Unknown',
        time: new Date(outage.reportedAt).toLocaleTimeString(),
        actionUrl: `/outage/${outage._id}`,
      });
    });

    // Sort by time
    myTasks.sort((a, b) => new Date(a.time) - new Date(b.time));

    return NextResponse.json({
      tasks: {
        pendingReadings,
        assignedOutages,
        verifications,
        completedToday,
      },
      myTasks,
    });
  } catch (error) {
    console.error('Field officer tasks error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  }
