"use client";
import { useState } from "react";

export default function EnergyEntry() {
  const [data, setData] = useState({});

  async function submit() {
    await fetch("/api/feeders/energy-entry", {
      method: "POST",
      body: JSON.stringify(data),
    });

    alert("Energy Recorded");
  }

  return (
    <div>
      <h1>Feeder Energy Entry</h1>

      <input
        placeholder="Feeder ID"
        onChange={(e) => setData({ ...data, feederId: e.target.value })}
      />

      <input
        type="number"
        placeholder="Hours Supplied"
        onChange={(e) => setData({ ...data, hoursSupplied: e.target.value })}
      />

      <button onClick={submit}>Save</button>
    </div>
  );
}
