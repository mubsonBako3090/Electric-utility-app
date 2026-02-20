import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';

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

    const user = await User.findById(session.id).select('-password');
    const customer = await Customer.findOne({ userId: session.id });

    if (!user || !customer) {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: {
        ...user.toObject(),
        customerId: customer.customerId,
        meterNumber: customer.meterNumber,
        sanctionedLoad: customer.sanctionedLoad,
        connectionDate: customer.connectionDate,
        loadType: customer.loadType,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
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

    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user fields
    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.phone = data.phone || user.phone;
    user.address = data.address || user.address;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: user,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  }
