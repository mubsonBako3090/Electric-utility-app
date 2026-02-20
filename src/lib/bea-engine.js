import Customer from "@/models/Customer";
import EnergyReading from "@/models/EnergyReading";
import VacationStatus from "@/models/VacationStatus";
import { calculateBill } from "@/lib/billing-engine";
import Bill from "@/models/Bill";

export async function runBEA({ feederId, month }) {

  // 1️⃣ Get total supply hours for that feeder in that month
  const readings = await EnergyReading.find({ feederId });

  const totalHours = readings.reduce((sum, r) => sum + r.hoursSupplied, 0);

  // 2️⃣ Get all verified customers connected to feeder
  const customers = await Customer.find({
    feederId,
    verified: true,
  });

  // 3️⃣ Remove customers on vacation
  const vacations = await VacationStatus.find({ status: "active" });

  const vacationIds = vacations.map(v => v.customerId.toString());

  const activeCustomers = customers.filter(
    c => !vacationIds.includes(c._id.toString())
  );

  // 4️⃣ Generate bills only for ACTIVE customers
  for (const customer of activeCustomers) {

    const result = calculateBill({
      supplyHours: totalHours,
      category: customer.category,
    });

    await Bill.create({
      customerId: customer._id,
      month,
      totalHours,
      loadFactor: result.loadFactor,
      amount: result.amount,
      breakdown: result,
    });
  }

  return {
    totalCustomers: customers.length,
    billedCustomers: activeCustomers.length,
    excludedVacation: vacationIds.length,
  };
    }
