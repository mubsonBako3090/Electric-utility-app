import { NextResponse } from 'next/server';
import { withDatabase } from '@/lib/database';
import User from '@/models/User';
import { generateToken, setTokenCookie } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/utils';

export const POST = withDatabase(async (request) => {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, address, customerType } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      address: {
        street: address.street?.trim() || '',
        city: address.city?.trim() || '',
        state: address.state?.trim() || '',
        zipCode: address.zipCode?.trim() || '',
        country: address.country?.trim() || 'US'
      },
      customerType: customerType || 'residential'
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    await user.updateLastLogin();

    // Create response with user data (excluding password)
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      accountNumber: user.accountNumber,
      meterNumber: user.meterNumber,
      customerType: user.customerType,
      address: user.address,
      preferences: user.preferences,
      lastLogin: user.lastLogin
    };

    const response = NextResponse.json(
      successResponse({ user: userResponse }, 'Registration successful')
    );

    // Set cookie
    setTokenCookie(response, token);

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    
    const errorData = handleError(error);
    return NextResponse.json(
      { success: false, error: errorData.error, details: errorData.details },
      { status: 400 }
    );
  }
});