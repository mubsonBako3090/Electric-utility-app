import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/lib/models/Patient';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const patients = await Patient.find()
      .populate({
        path: 'userId',
        select: 'name email phone profileImage'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const formattedPatients = patients.map(patient => ({
      id: patient._id.toString(),
      name: patient.userId.name,
      email: patient.userId.email,
      image: patient.userId.profileImage,
      age: calculateAge(patient.dateOfBirth),
      gender: patient.gender,
      department: 'General', // You might want to add this to the schema
      doctorName: 'Dr. Smith', // You might want to add this to the schema
      status: getRandomStatus(),
      lastVisit: formatLastVisit(patient.updatedAt)
    }));

    return NextResponse.json(formattedPatients);
  } catch (error) {
    console.error('Error fetching recent patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

function calculateAge(dob) {
  if (!dob) return 'N/A';
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getRandomStatus() {
  const statuses = ['active', 'stable', 'critical', 'discharged'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

function formatLastVisit(date) {
  if (!date) return 'Never';
  const now = new Date();
  const last = new Date(date);
  const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return last.toLocaleDateString();
        }
