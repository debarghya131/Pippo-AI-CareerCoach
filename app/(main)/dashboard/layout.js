import Link from "next/link";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getViewerContext } from "@/lib/demo-server";
import { SignInButton } from "@clerk/nextjs";

export default async function Layout({ children }) {
  const { userId, isDemoMode: demoMode } = await getViewerContext();

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
        {demoMode ? (
          !userId ? (
            <SignInButton
              mode="modal"
              forceRedirectUrl="/demo/exit?next=/dashboard"
            >
              <Button variant="outline">Sign In to Edit</Button>
            </SignInButton>
          ) : (
            <Button asChild variant="outline">
              <a href="/demo/exit?next=/dashboard">Exit Demo to Edit</a>
            </Button>
          )
        ) : (
          <Button asChild variant="outline">
            <Link href="/onboarding">Edit Profile</Link>
          </Button>
        )}
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
