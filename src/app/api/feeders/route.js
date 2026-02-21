import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Feeder from '@/models/Feeder';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const feeders = await Feeder.find()
      .populate('assignedOfficer', 'name email')
      .sort({ name: 1 });

    // Calculate stats
    const stats = {
      totalFeeders: feeders.length,
      activeFeeders: feeders.filter(f => f.status === 'active').length,
      totalLoad: feeders.reduce((sum, f) => sum + f.currentLoad, 0).toFixed(1),
      avgVoltage: (feeders.reduce((sum, f) => sum + f.voltage, 0) / feeders.length || 0).toFixed(1),
    };

    return NextResponse.json({
      feeders,
      stats,
    });
  } catch (error) {
    console.error('Error fetching feeders:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Generate feeder ID
    const feederId = `FDR${Date.now().toString().slice(-8)}`;

    const feeder = await Feeder.create({
      ...data,
      feederId,
    });

    return NextResponse.json({
      message: 'Feeder created successfully',
      feeder,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating feeder:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
        }
