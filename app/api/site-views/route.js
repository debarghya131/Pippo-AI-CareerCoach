import { NextResponse } from "next/server";
import { getWebsiteViews, incrementWebsiteViews } from "@/lib/site-views";

export async function GET() {
  const count = await getWebsiteViews();

  if (count === null) {
    return NextResponse.json(
      { error: "Unable to read website views" },
      { status: 500 }
    );
  }

  return NextResponse.json({ count });
}

export async function POST() {
  const count = await incrementWebsiteViews();

  if (count === null) {
    return NextResponse.json(
      { error: "Unable to update website views" },
      { status: 500 }
    );
  }

  return NextResponse.json({ count });
}
