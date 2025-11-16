"use client";

import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthChange } from "@/lib/firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

