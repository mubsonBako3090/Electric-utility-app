import { connectDB } from "@/lib/mongodb";
import EnergyReading from "@/models/EnergyReading";

export async function POST(req) {
  await connectDB();

  const { feederId, date, hoursSupplied } = await req.json();

  await EnergyReading.create({
    feederId,
    date,
    hoursSupplied,
  });

  return Response.json({ message: "Energy reading recorded" });
}
