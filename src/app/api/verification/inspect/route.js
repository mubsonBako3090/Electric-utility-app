import { connectDB } from "@/lib/mongodb";
import VerificationReport from "@/models/VerificationReport";
import Customer from "@/models/Customer";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const { customerId, actualCategory, notes, approved, officerId } = body;

  await VerificationReport.create({
    customerId,
    officerId,
    actualCategory,
    notes,
    approved,
  });

  if (approved) {
    await Customer.findByIdAndUpdate(customerId, {
      category: actualCategory,
      inspectionStatus: "confirmed",
      verified: true,
    });
  } else {
    await Customer.findByIdAndUpdate(customerId, {
      inspectionStatus: "rejected",
    });
  }

  return Response.json({ message: "Inspection submitted" });
      }
