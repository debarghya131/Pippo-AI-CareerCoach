import Link from "next/link";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
        <Button asChild variant="outline">
          <Link href="/onboarding">Edit Profile</Link>
        </Button>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}
