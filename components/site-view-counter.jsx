"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const SESSION_VIEW_KEY = "pippo-ai-site-view-counted";

function formatViewCount(count) {
  if (typeof count !== "number") return "--";

  return new Intl.NumberFormat("en", {
    notation: count >= 10000 ? "compact" : "standard",
    maximumFractionDigits: count >= 10000 ? 1 : 0,
  }).format(count);
}

export default function SiteViewCounter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let ignore = false;
    const hasCountedThisSession =
      window.sessionStorage.getItem(SESSION_VIEW_KEY) === "true";
    const shouldIncrement = !hasCountedThisSession;

    if (shouldIncrement) {
      window.sessionStorage.setItem(SESSION_VIEW_KEY, "true");
    }

    async function syncViews() {
      const response = await fetch("/api/site-views", {
        method: shouldIncrement ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) return;

      const data = await response.json();

      if (typeof data.count === "number" && !ignore) {
        setCount(data.count);
      }
    }

    syncViews().catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-primary/25 bg-primary/10 px-2 py-1 text-[11px] font-medium text-foreground shadow-sm sm:gap-1.5 sm:px-2.5 sm:text-xs"
      aria-label={`${count} website views`}
      title="Website views"
    >
      <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
      <span className="tabular-nums">{formatViewCount(count)}</span>
      <span className="hidden sm:inline">views</span>
    </div>
  );
}
