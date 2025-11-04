import { NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import User from '@/models/User';
import { generateToken, setTokenCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { firstName, lastName, email, password, phone, address, customerType } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !address) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      customerType: customerType || 'residential'
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountNumber: user.accountNumber,
        customerType: user.customerType
      }
    });

    // Set cookie
    setTokenCookie(response, token);

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
