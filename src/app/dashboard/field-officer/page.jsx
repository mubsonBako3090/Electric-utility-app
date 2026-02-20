"use client";
import { useState } from "react";

export default function FieldOfficer() {
  const [form, setForm] = useState({
    customerId: "",
    actualCategory: "R1",
    notes: "",
  });

  async function submitInspection() {
    await fetch("/api/verification/inspect", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        approved: true,
        officerId: "OFFICER_ID",
      }),
    });

    alert("Inspection Submitted");
  }

  return (
    <div>
      <h1>Field Verification</h1>

      <input
        placeholder="Customer ID"
        onChange={(e) => setForm({ ...form, customerId: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, actualCategory: e.target.value })}
      >
        <option value="R1">R1 Basic</option>
        <option value="R2">R2 Extended</option>
        <option value="R3">R3 Media</option>
        <option value="R4">R4 Heavy</option>
        <option value="C1">C1 Business</option>
      </select>

      <textarea
        placeholder="Inspection Notes"
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button onClick={submitInspection}>Submit</button>
    </div>
  );
        }
