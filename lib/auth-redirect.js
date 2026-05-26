import { headers } from "next/headers";

function getHeaderValue(headerStore, name) {
  return headerStore.get(name) || "";
}

function isSafeRelativePath(value) {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  );
}

export async function resolveAuthRedirect(redirectValue) {
  if (isSafeRelativePath(redirectValue)) {
    return redirectValue;
  }

  if (typeof redirectValue !== "string" || !redirectValue) {
    return null;
  }

  try {
    const requestHeaders = await headers();
    const host = getHeaderValue(requestHeaders, "x-forwarded-host") || getHeaderValue(requestHeaders, "host");
    const protocol =
      getHeaderValue(requestHeaders, "x-forwarded-proto") ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    if (!host) {
      return null;
    }

    const parsedUrl = new URL(redirectValue);
    const currentOrigin = `${protocol}://${host}`;

    if (parsedUrl.origin !== currentOrigin) {
      return null;
    }

    const safePath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    return isSafeRelativePath(safePath) ? safePath : null;
  } catch {
    return null;
  }
}
