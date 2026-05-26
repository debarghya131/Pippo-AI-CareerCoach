import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/demo-server";
import Quiz from "../_components/quiz";

export default async function MockInterviewPage() {
  const demoMode = await isDemoMode();

  return (
    <div className="container mx-auto space-y-4 px-4 py-6 sm:px-6 lg:px-0">
      <div className="mx-0 flex flex-col space-y-2 sm:mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-4xl font-bold gradient-title sm:text-5xl lg:text-6xl">
            Mock Interview
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>

      <Quiz isDemoMode={demoMode} />
    </div>
  );
}
