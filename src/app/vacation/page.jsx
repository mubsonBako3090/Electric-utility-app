"use client";
import { useState } from "react";

export default function Vacation() {
  const [form, setForm] = useState({});

  async function submit() {
    await fetch("/api/vacation/declare", {
      method: "POST",
      body: JSON.stringify({
        customerId: "CUSTOMER_ID",
        ...form,
      }),
    });

    alert("Vacation Activated");
  }

  return (
    <div>
      <h1>Declare Temporary Vacancy</h1>

      <input
        type="date"
        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
      />
      <input
        type="date"
        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}
