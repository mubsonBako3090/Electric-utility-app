import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";

export async function POST(req) {
  await connectDB();

  const { customerId } = await req.json();

  const bills = await Bill.find({ customerId });

  return Response.json(bills);
}
