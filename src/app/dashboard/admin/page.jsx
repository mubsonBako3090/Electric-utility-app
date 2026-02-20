"use client";
import { useState } from "react";

export default function AdminDashboard() {
  const [msg, setMsg] = useState("");

  async function runBilling() {
    const res = await fetch("/api/billing/run", {
      method: "POST",
      body: JSON.stringify({
        feederId: "FEEDER_OBJECT_ID",
        month: "Feb-2026",
      }),
    });

    const data = await res.json();
    setMsg(data.message);
  }

  return (
    <div>
      <h1>Admin Control Panel</h1>

      <button onClick={runBilling}>Run Monthly Billing</button>

      <p>{msg}</p>
    </div>
  );
        }
