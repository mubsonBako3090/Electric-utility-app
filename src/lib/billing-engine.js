import Bill from '@/models/Bill';
import Customer from '@/models/Customer';
import EnergyReading from '@/models/EnergyReading';

// Tariff rates by category (₹ per kWh)
const TARIFF_RATES = {
  R1: 4.5,  // Residential - Small
  R2: 5.0,  // Residential - Medium
  R3: 5.5,  // Residential - Large
  R4: 6.0,  // Residential - Premium
  R5: 6.5,  // Residential - High-end
  C1: 7.5,  // Commercial - Small
  C2: 8.5,  // Commercial - Large
};

// Fixed charges by category (₹ per month)
const FIXED_CHARGES = {
  R1: 100,
  R2: 150,
  R3: 200,
  R4: 300,
  R5: 500,
  C1: 800,
  C2: 1500,
};

// Tax rate (%)
const TAX_RATE = 5;

export async function generateBillNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const count = await Bill.countDocuments() + 1;
  return `BILL${year}${month}${count.toString().padStart(6, '0')}`;
}

export async function calculateBill(customerId, billingPeriod) {
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Get readings for the period
    const readings = await EnergyReading.find({
      customerId,
      readingDate: {
        $gte: billingPeriod.from,
        $lte: billingPeriod.to,
      },
    }).sort({ readingDate: 1 });

    if (readings.length < 2) {
      throw new Error('Insufficient readings for billing period');
    }

    const firstReading = readings[0];
    const lastReading = readings[readings.length - 1];

    // Calculate units consumed
    const unitsConsumed = lastReading.readingValue - firstReading.readingValue;

    // Get tariff rates
    const ratePerUnit = TARIFF_RATES[customer.loadType] || 5.0;
    const fixedCharge = FIXED_CHARGES[customer.loadType] || 100;

    // Calculate charges
    const energyCharges = unitsConsumed * ratePerUnit;
    const taxes = (energyCharges + fixedCharge) * (TAX_RATE / 100);
    const totalAmount = energyCharges + fixedCharge + taxes;

    return {
      customerId: customer._id,
      billingPeriod,
      previousReading: {
        value: firstReading.readingValue,
        date: firstReading.readingDate,
      },
      currentReading: {
        value: lastReading.readingValue,
        date: lastReading.readingDate,
      },
      unitsConsumed,
      tariffRate: ratePerUnit,
      energyCharges,
      fixedCharges: fixedCharge,
      taxes,
      totalAmount,
    };
  } catch (error) {
    console.error('Bill calculation error:', error);
    throw error;
  }
}

export async function generateBillsForAllCustomers() {
  try {
    const customers = await Customer.find({ status: 'active' });
    const results = [];

    for (const customer of customers) {
      try {
        // Set billing period (last month)
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const to = new Date(now.getFullYear(), now.getMonth(), 0);

        // Check if bill already exists for this period
        const existingBill = await Bill.findOne({
          customerId: customer._id,
          'billingPeriod.from': from,
          'billingPeriod.to': to,
        });

        if (existingBill) {
          results.push({
            customerId: customer._id,
            status: 'skipped',
            reason: 'Bill already exists',
          });
          continue;
        }

        // Calculate bill
        const billData = await calculateBill(customer._id, { from, to });
        
        // Generate bill number
        const billNumber = await generateBillNumber();

        // Create bill
        const bill = await Bill.create({
          ...billData,
          billNumber,
          dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
          status: 'generated',
        });

        results.push({
          customerId: customer._id,
          status: 'success',
          billId: bill._id,
          amount: bill.totalAmount,
        });
      } catch (error) {
        results.push({
          customerId: customer._id,
          status: 'failed',
          reason: error.message,
        });
      }
    }

    return {
      total: customers.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      details: results,
    };
  } catch (error) {
    console.error('Batch bill generation error:', error);
    throw error;
  }
}

export function calculateLateFee(amount, dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  
  if (now <= due) return 0;

  const daysLate = Math.ceil((now - due) / (1000 * 60 * 60 * 24));
  const lateFeeRate = 0.01; // 1% per month
  const lateFee = amount * (lateFeeRate / 30) * daysLate;

  return Math.min(lateFee, amount * 0.1); // Max 10% late fee
}
