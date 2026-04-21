"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin !== "true") {
      router.replace("/admin/login");
    }
  }, [router]);

  if (typeof window === "undefined") {
    return <p>Loading...</p>;
  }

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    return <p>Checking access...</p>;
  }

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <p>You are logged in.</p>
    </main>
  );
}