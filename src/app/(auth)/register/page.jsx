"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({});

  async function submit() {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h1>Customer Registration</h1>

      <input
        placeholder="Full Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option value="R1">R1 — Basic Lighting (1–5 bulbs)</option>
        <option value="R2">R2 — Extended Lighting</option>
        <option value="R3">R3 — Lighting + TV + Cooking</option>
        <option value="R4">R4 — Heavy Residential</option>
        <option value="C1">C1 — Small Business</option>
      </select>

      <button onClick={submit}>Register</button>
    </div>
  );
    }
