"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export default function PerformanceChart({ assessments }) {
  const chartData =
    assessments?.map((assessment, index) => ({
      id: assessment.id,
      label: format(new Date(assessment.createdAt), "MMM dd"),
      fullDate: format(new Date(assessment.createdAt), "MMM dd, yyyy"),
      score: Number(assessment.quizScore.toFixed(1)),
      quizNumber: index + 1,
    })) || [];

  return (
    <Card className="border-white/10 bg-neutral-950 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription className="text-sm text-neutral-400">
          Your quiz scores over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 18, right: 12, left: -20, bottom: 4 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.22)"
                strokeDasharray="2 4"
                vertical={true}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{
                  stroke: "rgba(255,255,255,0.45)",
                  strokeWidth: 1,
                }}
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="rounded-xl border border-white/10 bg-black/85 px-3 py-2 shadow-2xl backdrop-blur-sm">
                        <p className="text-sm font-semibold text-white">
                          Score: {payload[0].value}%
                        </p>
                        <p className="text-xs text-neutral-400">
                          {payload[0].payload.fullDate}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="natural"
                dataKey="score"
                stroke="#f5f5f5"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#f5f5f5",
                  stroke: "rgba(255,255,255,0.12)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: "#ffffff",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
