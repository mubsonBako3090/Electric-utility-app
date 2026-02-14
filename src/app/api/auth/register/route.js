import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import Patient from '@/lib/models/Patient';
import Doctor from '@/lib/models/Doctor';

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      name, email, password, role, phone,
      dateOfBirth, gender, bloodGroup,
      street, city, state, zipCode, country,
      emergencyName, emergencyRelationship, emergencyPhone,
      allergies, medicalConditions
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address: {
        street,
        city,
        state,
        zipCode,
        country
      }
    });

    // Create role-specific profile
    if (role === 'patient') {
      await Patient.create({
        userId: user._id,
        dateOfBirth,
        gender,
        bloodGroup,
        emergencyContact: {
          name: emergencyName,
          relationship: emergencyRelationship,
          phone: emergencyPhone
        },
        allergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
        medicalHistory: medicalConditions ? [{
          condition: medicalConditions,
          diagnosedDate: new Date(),
          notes: 'Initial registration'
        }] : []
      });
    } else if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: 'General Medicine',
        licenseNumber: `TEMP-${Date.now()}`,
        experience: 0,
        department: 'General',
        consultationFee: 0,
        availability: []
      });
    }

    return NextResponse.json(
      { message: 'User registered successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed', error: error.message },
      { status: 500 }
    );
  }
        }
