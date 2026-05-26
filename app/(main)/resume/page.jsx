import { getResume } from "@/actions/resume";
import { demoProfile } from "@/lib/demo-data";
import { isDemoMode } from "@/lib/demo-server";
import ResumeBuilder from "./_components/resume-builder";

export default async function ResumePage() {
  const [resume, demoMode] = await Promise.all([getResume(), isDemoMode()]);

  return (
    <div className="container mx-auto py-6">
      <ResumeBuilder
        initialContent={resume?.content}
        isDemoMode={demoMode}
        viewerName={demoMode ? demoProfile.name : null}
      />
    </div>
  );
}
