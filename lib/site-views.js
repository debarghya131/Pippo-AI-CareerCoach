import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/prisma";

const WEBSITE_VIEWS_KEY = "website-views";

export async function getWebsiteViews() {
  noStore();

  try {
    const metric = await db.siteMetric.findUnique({
      where: { key: WEBSITE_VIEWS_KEY },
      select: { count: true },
    });

    return metric?.count ?? 0;
  } catch (error) {
    console.error("Failed to read website views", error);
    return null;
  }
}

export async function incrementWebsiteViews() {
  try {
    const metric = await db.siteMetric.upsert({
      where: { key: WEBSITE_VIEWS_KEY },
      create: {
        key: WEBSITE_VIEWS_KEY,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
      select: { count: true },
    });

    return metric.count;
  } catch (error) {
    console.error("Failed to increment website views", error);
    return null;
  }
}
