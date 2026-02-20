import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
      }
