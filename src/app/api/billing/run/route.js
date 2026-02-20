import { connectDB } from "@/lib/mongodb";
import { runBEA } from "@/lib/bea-engine";

export async function POST(req) {
  await connectDB();

  const { feederId, month } = await req.json();

  const result = await runBEA({ feederId, month });

  return Response.json({
    message: "Billing Completed",
    result,
  });
}
