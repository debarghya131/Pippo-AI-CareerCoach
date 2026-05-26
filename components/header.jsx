import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { getViewerContext } from "@/lib/demo-server";
import {
  ResilientSignInButton,
  ResilientSignUpButton,
} from "@/components/resilient-auth-buttons";

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

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="PippoAI Logo"
            width={340}
            height={102}
            className="h-12 w-auto object-contain md:h-20"
          />
        </Link>

        <div className="hidden items-center space-x-2 md:flex md:space-x-4">
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
              <ResilientSignUpButton forceRedirectUrl="/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Industry Insights
                </Button>
              </ResilientSignUpButton>
              <ResilientSignUpButton forceRedirectUrl="/dashboard">
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </ResilientSignUpButton>

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
                    <ResilientSignUpButton forceRedirectUrl="/resume">
                      <button type="button" className="flex w-full items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Build Resume
                      </button>
                    </ResilientSignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ResilientSignUpButton forceRedirectUrl="/ai-cover-letter">
                      <button type="button" className="flex w-full items-center gap-2">
                        <PenBox className="h-4 w-4" />
                        Cover Letter
                      </button>
                    </ResilientSignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ResilientSignUpButton forceRedirectUrl="/interview">
                      <button type="button" className="flex w-full items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Interview Prep
                      </button>
                    </ResilientSignUpButton>
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
            <ResilientSignInButton
              mode="redirect"
              {...(demoMode
                ? { forceRedirectUrl: "/demo/exit?next=/dashboard" }
                : {})}
            >
              <Button variant="outline">Sign In</Button>
            </ResilientSignInButton>
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

        <div className="flex items-center gap-2 md:hidden">
          {showRealAppLinks && (
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" aria-label={dashboardLabel}>
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation menu">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {showRealAppLinks ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      {dashboardLabel}
                    </Link>
                  </DropdownMenuItem>
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
                  {!userId && (
                    <DropdownMenuItem asChild>
                      <ResilientSignInButton
                        mode="redirect"
                        {...(demoMode
                          ? {
                              forceRedirectUrl:
                                "/demo/exit?next=/dashboard",
                            }
                          : {})}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center gap-2"
                        >
                          <StarsIcon className="h-4 w-4" />
                          Sign In
                        </button>
                      </ResilientSignInButton>
                    </DropdownMenuItem>
                  )}
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <ResilientSignUpButton forceRedirectUrl="/dashboard">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Industry Insights
                      </button>
                    </ResilientSignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ResilientSignUpButton forceRedirectUrl="/resume">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Build Resume
                      </button>
                    </ResilientSignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ResilientSignUpButton forceRedirectUrl="/ai-cover-letter">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2"
                      >
                        <PenBox className="h-4 w-4" />
                        Cover Letter
                      </button>
                    </ResilientSignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ResilientSignUpButton forceRedirectUrl="/interview">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2"
                      >
                        <GraduationCap className="h-4 w-4" />
                        Interview Prep
                      </button>
                    </ResilientSignUpButton>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/demo" className="flex items-center gap-2">
                      <StarsIcon className="h-4 w-4" />
                      Watch Demo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <ResilientSignInButton mode="redirect">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2"
                      >
                        <StarsIcon className="h-4 w-4" />
                        Sign In
                      </button>
                    </ResilientSignInButton>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {userId && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
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
