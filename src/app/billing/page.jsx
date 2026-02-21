import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Bill from '@/models/Bill';
import Customer from '@/models/Customer';
import { generateBillNumber } from '@/lib/billing-engine';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    await connectDB();

    let query = {};

    // Filter by user role
    if (session.role === 'customer') {
      const customer = await Customer.findOne({ userId: session.id });
      if (customer) {
        query.customerId = customer._id;
      }
    }

    if (status) query.status = status;

    const bills = await Bill.find(query)
      .populate('customerId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Bill.countDocuments(query);

    return NextResponse.json({
      bills: bills.map(bill => ({
        id: bill._id,
        billNumber: bill.billNumber,
        period: `${new Date(bill.billingPeriod.from).toLocaleDateString()} - ${new Date(bill.billingPeriod.to).toLocaleDateString()}`,
        amount: bill.totalAmount,
        dueDate: bill.dueDate,
        status: bill.status,
        customerName: bill.customerId?.name,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Billing API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Generate bill number
    const billNumber = await generateBillNumber();

    const bill = await Bill.create({
      ...data,
      billNumber,
      status: 'generated',
    });

    return NextResponse.json({
      message: 'Bill generated successfully',
      bill,
    }, { status: 201 });
  } catch (error) {
    console.error('Bill generation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
