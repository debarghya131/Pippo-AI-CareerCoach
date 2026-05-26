"use client";

import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateView = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateView);

    return () => mediaQuery.removeEventListener("change", updateView);
  }, []);

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
        <CardTitle className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
        <CardDescription className="text-sm text-neutral-400">
          Your quiz scores over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] sm:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 18,
                right: isMobile ? 4 : 12,
                left: isMobile ? -32 : -20,
                bottom: 4,
              }}
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
                minTickGap={isMobile ? 32 : 16}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis
                domain={[0, 100]}
                ticks={isMobile ? [0, 50, 100] : [0, 25, 50, 75, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(255,255,255,0.42)", fontSize: isMobile ? 10 : 12 }}
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
                strokeWidth={isMobile ? 2 : 2.5}
                dot={{
                  r: isMobile ? 3 : 4,
                  fill: "#f5f5f5",
                  stroke: "rgba(255,255,255,0.12)",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: isMobile ? 4 : 5,
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
