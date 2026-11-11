"use client";

import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebase } from "./firebase";

/**
 * Signs the browser in anonymously in the background. Nobody types anything;
 * the account only lets this browser manage the questions it created.
 */
export function useAnonUser() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { auth } = firebase();
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        return;
      }
      signInAnonymously(auth).catch(() =>
        setError("Couldn't connect. Check your internet connection and reload the page."),
      );
    });
  }, []);

  return { user, error };
}
