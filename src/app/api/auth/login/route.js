import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  if (!user.approved) {
    return Response.json({ error: "Awaiting Admin Approval" }, { status: 403 });
  }

  const token = signToken({ id: user._id, role: user.role });

  return Response.json({
    token,
    role: user.role,
  });
      }
