import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import { isDemoMode } from "@/lib/demo-server";

export default async function InterviewPrepPage() {
  const [assessments, demoMode] = await Promise.all([
    getAssessments(),
    isDemoMode(),
  ]);

  return (
    <div className="px-0">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-title sm:text-5xl lg:text-6xl">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} isDemoMode={demoMode} />
      </div>
    </div>
  );
}
