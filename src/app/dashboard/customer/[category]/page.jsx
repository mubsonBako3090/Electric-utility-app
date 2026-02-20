"use client";
import { useParams } from "next/navigation";

export default function CustomerDashboard() {
  const { category } = useParams();

  return (
    <div>
      <h1>Customer Dashboard — {category}</h1>

      <p>Your billing is calculated based on verified load category.</p>

      <a href="/billing">View Bills</a>
      <br />
      <a href="/vacation">Declare Vacation</a>
      <br />
      <a href="/outage">Report Outage</a>
    </div>
  );
}
