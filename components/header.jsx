import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getViewerContext } from "@/lib/demo-server";
import HeaderActions from "@/components/header-actions";

export default async function Header() {
  const { userId, isDemoMode: demoMode } = await getViewerContext();

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
        <HeaderActions hasUser={!!userId} isDemoMode={demoMode} />
      </nav>
    </header>
  );
}
