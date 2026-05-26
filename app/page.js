import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
} from "lucide-react";
import HeroSection from "@/components/hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import { getViewerContext } from "@/lib/demo-server";
import { SignUpButton } from "@clerk/nextjs";

export default async function LandingPage() {
  const { userId, isDemoMode } = await getViewerContext();
  const dashboardHref = isDemoMode ? "/demo/exit?next=/dashboard" : "/dashboard";

  return (
    <>
      <div className="grid-background"></div>

      {/* Hero Section */}
      <HeroSection
        isAuthenticated={!!userId}
        dashboardHref={dashboardHref}
      />

      {/* Features Section */}
      <section className="w-full bg-background py-10 sm:py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mx-auto mb-10 max-w-xl text-center text-2xl font-bold tracking-tighter sm:mb-12 sm:text-3xl">
            Powerful Features for Your Career Growth
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 transition-colors duration-300 hover:border-primary"
              >
                <CardContent className="flex flex-col items-center px-5 pt-6 text-center sm:px-6">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="mb-2 text-lg font-bold sm:text-xl">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-muted/50 py-10 sm:py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-8">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold sm:text-4xl">50+</h3>
              <p className="text-sm text-muted-foreground sm:text-base">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold sm:text-4xl">1000+</h3>
              <p className="text-sm text-muted-foreground sm:text-base">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold sm:text-4xl">95%</h3>
              <p className="text-sm text-muted-foreground sm:text-base">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold sm:text-4xl">24/7</h3>
              <p className="text-sm text-muted-foreground sm:text-base">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-background py-10 sm:py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">How It Works</h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Four simple steps to accelerate your career growth
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 rounded-2xl border border-border/50 bg-muted/20 px-5 py-6 text-center md:border-none md:bg-transparent md:px-0 md:py-0"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold sm:text-xl">{item.title}</h3>
                <p className="text-sm text-muted-foreground sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-muted/50 py-10 sm:py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
            What Our Users Say
          </h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="mb-4 flex items-center space-x-3 sm:space-x-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="rounded-full border-2 border-primary/20 object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="truncate text-sm text-primary">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="relative pr-3 text-sm italic text-muted-foreground sm:text-base">
                        <span className="absolute -left-2 -top-4 text-3xl text-primary">
                          &quot;
                        </span>
                        {testimonial.quote}
                        <span className="absolute bottom-0 right-0 hidden text-3xl text-primary sm:inline">
                          &quot;
                        </span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-10 sm:py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm leading-6 sm:text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-6 text-muted-foreground sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full">
        <div className="mx-auto rounded-lg gradient px-4 py-16 sm:px-6 md:py-24">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            {userId ? (
              <Link href={dashboardHref} passHref>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-5 h-11 w-full animate-bounce sm:w-auto"
                >
                  Start Your Journey Today{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <SignUpButton forceRedirectUrl={dashboardHref}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-5 h-11 w-full animate-bounce sm:w-auto"
                >
                  Start Your Journey Today{" "}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
