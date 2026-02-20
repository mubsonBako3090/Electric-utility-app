import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Outage from '@/models/Outage';
import Customer from '@/models/Customer';
import { sendOutageNotification } from '@/lib/notification-service';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    await connectDB();

    let query = {};

    // Filter by user role
    if (session.role === 'customer') {
      const customer = await Customer.findOne({ userId: session.id });
      if (customer) {
        query['customerId'] = customer._id;
      }
    }

    if (status) query.status = status;
    if (type) query.type = type;

    const outages = await Outage.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTeam')
      .populate('assignedOfficer', 'name')
      .sort({ reportedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Outage.countDocuments(query);

    return NextResponse.json({
      outages,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching outages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Get customer if user is customer
    let customerId = null;
    if (session.role === 'customer') {
      const customer = await Customer.findOne({ userId: session.id });
      if (customer) {
        customerId = customer._id;
      }
    }

    // Create outage
    const outage = await Outage.create({
      ...data,
      reportedBy: session.id,
      customerId,
      status: 'reported',
      reportedAt: new Date(),
      updates: [{
        message: data.description || 'Outage reported',
        status: 'reported',
        timestamp: new Date(),
      }],
    });

    // Send notifications (optional)
    try {
      await sendOutageNotification(outage);
    } catch (notifError) {
      console.error('Notification error:', notifError);
    }

    return NextResponse.json({
      message: 'Outage reported successfully',
      outage
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating outage:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  }
