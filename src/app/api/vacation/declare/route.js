import { connectDB } from "@/lib/mongodb";
import VacationStatus from "@/models/VacationStatus";

export async function POST(req) {
  await connectDB();

  const { customerId, startDate, endDate } = await req.json();

  await VacationStatus.create({
    customerId,
    startDate,
    endDate,
  });

  return Response.json({ message: "Vacation recorded" });
}
