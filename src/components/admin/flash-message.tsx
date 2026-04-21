"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type FlashMessageProps = {
  message: string;
  variant?: "success" | "error";
  clearUrl?: boolean;
};

export default function FlashMessage({
  message,
  variant = "success",
  clearUrl = false,
}: FlashMessageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);

      if (clearUrl) {
        router.replace(pathname);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname, router, clearUrl]);

  if (!visible) return null;

  return (
    <p className={variant === "error" ? "mt-4 text-red-600" : "mt-4 text-green-600"}>
      {message}
    </p>
  );
}