"use client";
import { useEffect, useState } from "react";
export const dynamic = "force-dynamic";

export default function BillingPage() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch("/api/billing/customer", {
      method: "POST",
      body: JSON.stringify({ customerId: "CUSTOMER_ID" }),
    })
      .then((res) => res.json())
      .then(setBills);
  }, []);

  return (
    <div>
      <h1>Your Bills</h1>

      {bills.map((bill) => (
        <div key={bill._id}>
          <p>Month: {bill.month}</p>
          <p>Supply Hours: {bill.totalHours}</p>
          <p>Load Factor: {bill.loadFactor}</p>
          <p>Amount: ₦{bill.amount}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}
