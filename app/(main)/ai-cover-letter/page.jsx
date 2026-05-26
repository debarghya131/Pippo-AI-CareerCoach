import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";
import { isDemoMode } from "@/lib/demo-server";

export default async function CoverLetterPage() {
  const [coverLetters, demoMode] = await Promise.all([
    getCoverLetters(),
    isDemoMode(),
  ]);

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-4xl font-bold gradient-title sm:text-5xl lg:text-6xl">
          My Cover Letters
        </h1>
        <Link href="/ai-cover-letter/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {demoMode ? "Preview Generator" : "Create New"}
          </Button>
        </Link>
      </div>

      <CoverLetterList coverLetters={coverLetters} isDemoMode={demoMode} />
    </div>
  );
}
