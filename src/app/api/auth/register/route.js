import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Customer from '@/models/Customer';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, password, phone, customerCategory, address } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer',
      customerCategory,
      address,
    });

    // Generate customer ID
    const customerId = `CUST${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create customer profile
    await Customer.create({
      userId: user._id,
      customerId,
      loadType: customerCategory,
      sanctionedLoad: getSanctionedLoad(customerCategory),
      meterNumber: `MTR${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: 'active',
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSanctionedLoad(category) {
  const loads = {
    R1: 1, // 1 kW
    R2: 2,
    R3: 3,
    R4: 5,
    R5: 10,
    C1: 15,
    C2: 30,
  };
  return loads[category] || 1;
}
