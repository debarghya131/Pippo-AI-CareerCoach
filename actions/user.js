"use server";

import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";
import { demoProfile } from "@/lib/demo-data";
import { getViewerContext, requireWritableUser } from "@/lib/demo-server";
import { checkUser } from "@/lib/checkUser";

export async function updateUser(data) {
  const { userId } = await requireWritableUser();
  const user = await checkUser();

  if (!user) throw new Error("User not found");

  try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          const insights = await generateAIInsights(data.industry, userId);

          industryInsight = await tx.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      }
    );

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/onboarding");
    return {
      success: true,
      user: result.updatedUser,
      industryInsight: result.industryInsight,
    };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId, isDemoMode } = await getViewerContext();

  if (isDemoMode) {
    return { isOnboarded: true };
  }

  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await checkUser();

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}

export async function getCurrentUserProfile() {
  const { userId, isDemoMode } = await getViewerContext();

  if (isDemoMode) {
    return {
      industry: demoProfile.industry,
      experience: demoProfile.experience,
      bio: demoProfile.bio,
      skills: demoProfile.skills,
    };
  }

  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await checkUser();

    if (!user) throw new Error("User not found");

    return {
      industry: user.industry,
      experience: user.experience,
      bio: user.bio,
      skills: user.skills,
    };
  } catch (error) {
    console.error("Error fetching current user profile:", error);
    throw new Error("Failed to fetch current user profile");
  }
}
