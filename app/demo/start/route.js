import { NextResponse } from "next/server";
import { DEMO_MODE_COOKIE } from "@/lib/demo";

export async function GET(request) {
  const url = new URL("/dashboard", request.url);
  const response = NextResponse.redirect(url);

  response.cookies.set(DEMO_MODE_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
