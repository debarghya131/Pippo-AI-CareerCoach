import { NextResponse } from "next/server";
import { DEMO_MODE_COOKIE } from "@/lib/demo";

export async function GET(request) {
  const requestedPath = new URL(request.url).searchParams.get("next");
  const nextPath =
    requestedPath && requestedPath.startsWith("/") ? requestedPath : "/";

  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.set(DEMO_MODE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
