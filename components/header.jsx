import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { getViewerContext } from "@/lib/demo-server";

export default async function Header() {
  const { userId, isDemoMode: demoMode } = await getViewerContext();
  const isDemoGuest = demoMode && !userId;
  const showRealAppLinks = !!userId || demoMode;
  const dashboardLabel = isDemoGuest ? "Demo Dashboard" : "Industry Insights";
  const toolsLabel = isDemoGuest ? "Demo Tools" : "Growth Tools";
  const resumeLabel = isDemoGuest ? "Resume Preview" : "Build Resume";
  const coverLetterLabel = isDemoGuest
    ? "Cover Letter Preview"
    : "Cover Letter";
  const interviewLabel = isDemoGuest ? "Interview Preview" : "Interview Prep";

  if (userId && !demoMode) {
    await checkUser();
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="PippoAI Logo"
            width={340}
            height={102}
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {showRealAppLinks ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {dashboardLabel}
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <StarsIcon className="h-4 w-4" />
                    <span className="hidden md:block">{toolsLabel}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/resume" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {resumeLabel}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/ai-cover-letter"
                      className="flex items-center gap-2"
                    >
                      <PenBox className="h-4 w-4" />
                      {coverLetterLabel}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/interview" className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {interviewLabel}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <SignUpButton forceRedirectUrl="/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Industry Insights
                </Button>
              </SignUpButton>
              <SignUpButton forceRedirectUrl="/dashboard">
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </SignUpButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <StarsIcon className="h-4 w-4" />
                    <span className="hidden md:block">Growth Tools</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <SignUpButton forceRedirectUrl="/resume">
                      <button type="button" className="flex w-full items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Build Resume
                      </button>
                    </SignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SignUpButton forceRedirectUrl="/ai-cover-letter">
                      <button type="button" className="flex w-full items-center gap-2">
                        <PenBox className="h-4 w-4" />
                        Cover Letter
                      </button>
                    </SignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <SignUpButton forceRedirectUrl="/interview">
                      <button type="button" className="flex w-full items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Interview Prep
                      </button>
                    </SignUpButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!userId && !demoMode && (
            <Link href="/demo">
              <Button variant="outline" className="hidden md:inline-flex">
                Watch Demo
              </Button>
            </Link>
          )}

          {!userId && (
            <SignInButton
              {...(demoMode
                ? { forceRedirectUrl: "/demo/exit?next=/dashboard" }
                : {})}
            >
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          )}

          {userId && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl={demoMode ? "/demo/exit?next=/" : "/"}
            />
          )}
        </div>
      </nav>
    </header>
  );
}
