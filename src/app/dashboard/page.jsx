"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") router.push("/dashboard/admin");
    else if (role === "field-officer") router.push("/dashboard/field-officer");
    else router.push("/dashboard/customer/R1"); // dynamic later
  }, []);

  return <p>Loading dashboard...</p>;
}
