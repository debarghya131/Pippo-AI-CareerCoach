"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

const HeroSection = ({ isAuthenticated = false, dashboardHref = "/dashboard" }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full overflow-x-hidden px-4 pt-28 pb-10 md:px-0 md:pt-48">
      <div className="space-y-6 text-center">
        <div className="mx-auto space-y-6">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient">
            PippoAI for
            <br />
            Professional Success
          </h1>
          <p className="mx-auto max-w-[600px] text-sm text-muted-foreground sm:text-base md:text-xl">
            Advance your career with personalized guidance, interview prep, and
            AI-powered tools for job success.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          {isAuthenticated ? (
            <Link href={dashboardHref}>
              <Button size="lg" className="w-full px-8 sm:w-auto">
                Get Started
              </Button>
            </Link>
          ) : (
            <SignUpButton forceRedirectUrl={dashboardHref}>
              <Button size="lg" className="w-full px-8 sm:w-auto">
                Get Started
              </Button>
            </SignUpButton>
          )}
          <Link href="/demo">
            <Button size="lg" variant="outline" className="w-full px-8 sm:w-auto">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="mx-auto w-full max-w-[min(100%,1100px)] rounded-lg border shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
