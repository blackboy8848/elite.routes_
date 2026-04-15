import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { auth } from "./firebase";

function getAllowedAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS || import.meta.env.VITE_ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

const allowedAdminEmails = getAllowedAdminEmails();

export function isAdminUser(user: User | null): boolean {
  if (!user || !user.email) return false;
  if (allowedAdminEmails.length === 0) {
    // Fallback keeps app usable in local dev if env is missing.
    return true;
  }
  return allowedAdminEmails.includes(user.email.toLowerCase());
}

export function observeAdminAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export async function adminSignIn(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (!isAdminUser(result.user)) {
    await signOut(auth);
    throw new Error("This account is not authorized for admin access.");
  }
  return result.user;
}

export async function adminSignOut() {
  await signOut(auth);
}
