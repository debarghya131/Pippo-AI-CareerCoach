import Link from "next/link";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getViewerContext } from "@/lib/demo-server";
import { SignInButton } from "@clerk/nextjs";

export default async function Layout({ children }) {
  const { userId, isDemoMode: demoMode } = await getViewerContext();

  return (
    <div className="px-4 sm:px-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="max-w-3xl text-4xl font-bold gradient-title sm:text-5xl lg:text-6xl">
          Industry Insights
        </h1>
        {demoMode ? (
          !userId ? (
            <SignInButton
              mode="redirect"
              forceRedirectUrl="/demo/exit?next=/dashboard"
            >
              <Button variant="outline" className="w-full sm:w-auto">
                Sign In to Edit
              </Button>
            </SignInButton>
          ) : (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href="/demo/exit?next=/dashboard">Exit Demo to Edit</a>
            </Button>
          )
        ) : (
          <Button asChild variant="outline" className="w-full sm:w-auto">
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
