"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Watchdog ({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();


  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  status === "unauthenticated" ? router.push("/auth/prihlasenie") : null;

  //   status === "authenticated" && session && children;

  if (status === "authenticated" && session) {
    return children;
  }

  return null;
};
