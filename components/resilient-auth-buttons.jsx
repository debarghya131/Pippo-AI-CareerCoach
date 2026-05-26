"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { cloneElement, isValidElement } from "react";

function buildFallbackHref(path, forceRedirectUrl) {
  if (!forceRedirectUrl) {
    return path;
  }

  const params = new URLSearchParams({
    redirect_url: forceRedirectUrl,
  });

  return `${path}?${params.toString()}`;
}

function FallbackAction({ children, href }) {
  const router = useRouter();

  if (!isValidElement(children)) {
    return (
      <button type="button" onClick={() => router.push(href)}>
        {children}
      </button>
    );
  }

  return cloneElement(children, {
    onClick: (event) => {
      children.props.onClick?.(event);

      if (!event.defaultPrevented) {
        router.push(href);
      }
    },
  });
}

export function ResilientSignInButton({
  children,
  fallbackHref,
  forceRedirectUrl,
  mode = "redirect",
  ...props
}) {
  const href = fallbackHref ?? buildFallbackHref("/sign-in", forceRedirectUrl);

  return (
    <>
      <ClerkLoaded>
        <SignInButton
          mode={mode}
          forceRedirectUrl={forceRedirectUrl}
          {...props}
        >
          {children}
        </SignInButton>
      </ClerkLoaded>
      <ClerkLoading>
        <FallbackAction href={href}>{children}</FallbackAction>
      </ClerkLoading>
    </>
  );
}

export function ResilientSignUpButton({
  children,
  fallbackHref,
  forceRedirectUrl,
  ...props
}) {
  const href = fallbackHref ?? buildFallbackHref("/sign-up", forceRedirectUrl);

  return (
    <>
      <ClerkLoaded>
        <SignUpButton forceRedirectUrl={forceRedirectUrl} {...props}>
          {children}
        </SignUpButton>
      </ClerkLoaded>
      <ClerkLoading>
        <FallbackAction href={href}>{children}</FallbackAction>
      </ClerkLoading>
    </>
  );
}
