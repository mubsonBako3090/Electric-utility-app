import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Customer from "@/models/Customer";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();

  const body = await req.json();

  const { name, email, password, address, category } = body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "customer",
    approved: false,
  });

  await Customer.create({
    userId: user._id,
    address,
    category,
  });

  const token = signToken({ id: user._id, role: "customer" });

  return Response.json({ token, message: "Registered. Awaiting Inspection." });
    }
