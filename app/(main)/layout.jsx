import React from "react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { getViewerContext } from "@/lib/demo-server";

const MainLayout = async ({ children }) => {
  const { userId, isDemoMode: demoMode } = await getViewerContext();

  return (
    <div className="container mx-auto mt-24 mb-20 space-y-6">
      {demoMode && (
        <div className="flex flex-col gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 text-amber-400" />
            <div>
              <p className="font-medium text-amber-100">Demo Mode</p>
              <p className="text-sm text-amber-200/80">
                {userId
                  ? "You are viewing the sample PippoAI workspace. Exit demo whenever you want to return to your live account."
                  : "You can explore prebuilt PippoAI data here, but all actions stay read-only until you sign in."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!userId ? (
              <SignInButton
                mode="modal"
                forceRedirectUrl="/demo/exit?next=/dashboard"
              >
                <Button>Sign In For Full Access</Button>
              </SignInButton>
            ) : (
              <Button asChild variant="secondary">
                <a href="/demo/exit?next=/dashboard">Exit Demo</a>
              </Button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default MainLayout;
