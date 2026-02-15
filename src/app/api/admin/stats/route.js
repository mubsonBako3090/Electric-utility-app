
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/lib/models/Patient';
import Doctor from '@/lib/models/Doctor';
import Appointment from '@/lib/models/Appointment';
import Invoice from '@/lib/models/Invoice';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const [
      totalPatients,
      totalDoctors,
      todayAppointments,
      monthlyRevenue,
      pendingBills,
      totalBeds,
      occupiedBeds
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments({
        appointmentDate: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      }),
      Invoice.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            },
            status: 'paid'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total' }
          }
        }
      ]),
      Invoice.countDocuments({ status: 'pending' }),
      100, // Total beds - you might want to store this in settings
      Math.floor(Math.random() * 30) + 70 // Simulated occupancy
    ]);

    const stats = {
      totalPatients,
      totalDoctors,
      todayAppointments,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      pendingBills,
      occupancyRate: Math.round((occupiedBeds / totalBeds) * 100)
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
