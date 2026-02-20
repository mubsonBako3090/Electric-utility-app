import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Customer from "@/models/Customer";

export async function POST(req) {
  await connectDB();

  const { customerId } = await req.json();

  const customer = await Customer.findById(customerId);

  if (!customer.verified) {
    return Response.json({
      error: "Cannot approve — Field inspection not completed",
    }, { status: 400 });
  }

  await User.findByIdAndUpdate(customer.userId, {
    approved: true,
  });

  return Response.json({ message: "Customer approved successfully" });
}
