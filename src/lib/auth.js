import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      customerCategory: user.customerCategory,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  return token;
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  const payload = verifyToken(token);
  if (!payload) return null;
  
  return payload;
}

export function setTokenCookie(token) {
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function removeTokenCookie() {
  cookies().delete('token');
}
