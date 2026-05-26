import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/demo-server";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default async function NewCoverLetterPage() {
  const demoMode = await isDemoMode();

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-0">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <div className="pb-6">
          <h1 className="text-4xl font-bold gradient-title sm:text-5xl lg:text-6xl">
            Create Cover Letter
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Generate a tailored cover letter for your job application
          </p>
        </div>
      </div>

      <CoverLetterGenerator isDemoMode={demoMode} />
    </div>
  );
}
