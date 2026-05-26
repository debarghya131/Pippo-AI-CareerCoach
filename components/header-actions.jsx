"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResilientSignInButton,
  ResilientSignUpButton,
} from "@/components/resilient-auth-buttons";

const DEMO_WORKSPACE_PATHS = [
  "/dashboard",
  "/resume",
  "/interview",
  "/ai-cover-letter",
  "/onboarding",
];
const TOOL_PATHS = ["/resume", "/interview", "/ai-cover-letter"];

function isDemoWorkspacePath(pathname) {
  return DEMO_WORKSPACE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isCurrentPath(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isToolsPath(pathname) {
  return TOOL_PATHS.some((path) => isCurrentPath(pathname, path));
}

export default function HeaderActions({ hasUser = false, isDemoMode = false }) {
  const pathname = usePathname();
  const inDemoWorkspace = isDemoMode && isDemoWorkspacePath(pathname);
  const isDemoGuest = isDemoMode && !hasUser;
  const showWorkspaceLinks = hasUser || inDemoWorkspace;
  const dashboardActive = isCurrentPath(pathname, "/dashboard");
  const toolsActive = isToolsPath(pathname);
  const dashboardLabel = isDemoGuest ? "Demo Dashboard" : "Industry Insights";
  const toolsLabel = isDemoGuest ? "Demo Tools" : "Growth Tools";
  const resumeLabel = isDemoGuest ? "Resume Preview" : "Build Resume";
  const coverLetterLabel = isDemoGuest
    ? "Cover Letter Preview"
    : "Cover Letter";
  const interviewLabel = isDemoGuest ? "Interview Preview" : "Interview Prep";

  return (
    <>
      <div className="hidden items-center space-x-2 md:flex md:space-x-4">
        {showWorkspaceLinks ? (
          <>
            <Link href="/dashboard">
              <Button
                variant="outline"
                aria-current={dashboardActive ? "page" : undefined}
                className={`hidden md:inline-flex items-center gap-2 ${
                  dashboardActive
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : ""
                }`}
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
                <Button
                  variant={toolsActive ? "secondary" : "outline"}
                  aria-current={toolsActive ? "page" : undefined}
                  className="flex items-center gap-2"
                >
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
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {!hasUser && !inDemoWorkspace && (
          <Link href="/demo">
            <Button variant="outline" className="inline-flex">
              Watch Demo
            </Button>
          </Link>
        )}

        {!hasUser && (
          <ResilientSignInButton
            mode="redirect"
            {...(isDemoMode
              ? { forceRedirectUrl: "/demo/exit?next=/dashboard" }
              : {})}
          >
            <Button variant="outline">Sign In</Button>
          </ResilientSignInButton>
        )}

        {hasUser && (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard: "shadow-xl",
                userPreviewMainIdentifier: "font-semibold",
              },
            }}
            afterSignOutUrl={isDemoMode ? "/demo/exit?next=/" : "/"}
          />
        )}
      </div>

      <div className="flex items-center gap-2 md:hidden">
        {showWorkspaceLinks && (
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" aria-label={dashboardLabel}>
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {showWorkspaceLinks ? (
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
                {!hasUser && (
                  <DropdownMenuItem asChild>
                    <ResilientSignInButton
                      mode="redirect"
                      {...(isDemoMode
                        ? {
                            forceRedirectUrl: "/demo/exit?next=/dashboard",
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

        {hasUser && (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
                userButtonPopoverCard: "shadow-xl",
                userPreviewMainIdentifier: "font-semibold",
              },
            }}
            afterSignOutUrl={isDemoMode ? "/demo/exit?next=/" : "/"}
          />
        )}
      </div>
    </>
  );
}
