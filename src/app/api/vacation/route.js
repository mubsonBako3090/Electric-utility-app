import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import VacationStatus from '@/models/VacationStatus';
import Customer from '@/models/Customer';

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

    let query = {};

    // Filter by user role
    if (session.role === 'customer') {
      const customer = await Customer.findOne({ userId: session.id });
      if (customer) {
        query.customerId = customer._id;
      }
    } else if (session.role === 'field-officer') {
      // Field officers can see all in their area
      // Add area filter logic here
    }

    const vacations = await VacationStatus.find(query)
      .populate('customerId')
      .sort({ createdAt: -1 });

    return NextResponse.json({ vacations });
  } catch (error) {
    console.error('Error fetching vacations:', error);
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
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Get customer ID
    const customer = await Customer.findOne({ userId: session.id });
    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check for overlapping vacations
    const overlapping = await VacationStatus.findOne({
      customerId: customer._id,
      status: { $in: ['pending', 'approved', 'active'] },
      $or: [
        {
          fromDate: { $lte: data.toDate },
          toDate: { $gte: data.fromDate },
        },
      ],
    });

    if (overlapping) {
      return NextResponse.json(
        { message: 'You already have a vacation declared for this period' },
        { status: 400 }
      );
    }

    // Create vacation
    const vacation = await VacationStatus.create({
      ...data,
      customerId: customer._id,
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Vacation declared successfully',
      vacation,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating vacation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
    }
