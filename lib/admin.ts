import "server-only";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { authEnabled } from "./auth-config";

/** Owner-only access: the Clerk user IDs listed in ADMIN_USER_IDS. Everyone else gets a 404 (the panel stays invisible). */
const adminIds = () =>
  (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export async function isAdmin() {
  if (!authEnabled) return false;
  const { userId } = await auth();
  return Boolean(userId && adminIds().includes(userId));
}

/** Call at the top of every admin page and server action — layouts alone do not protect actions. */
export async function requireAdmin() {
  if (!(await isAdmin())) notFound();
}

export async function adminProfile() {
  const user = await currentUser();
  return { name: user?.fullName || user?.firstName || "Owner", email: user?.primaryEmailAddress?.emailAddress ?? "" };
}
