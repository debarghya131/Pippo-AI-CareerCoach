import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { DEMO_MODE_COOKIE, DEMO_READONLY_MESSAGE } from "./demo";

export async function getViewerContext() {
  const { userId } = await auth();
  const cookieStore = await cookies();
  const hasDemoCookie = cookieStore.get(DEMO_MODE_COOKIE)?.value === "1";

  return {
    userId,
    isDemoMode: hasDemoCookie,
  };
}

export async function isDemoMode() {
  return (await getViewerContext()).isDemoMode;
}

export async function requireWritableUser() {
  const { userId, isDemoMode: demoMode } = await getViewerContext();

  if (demoMode) {
    throw new Error(DEMO_READONLY_MESSAGE);
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return { userId };
}
