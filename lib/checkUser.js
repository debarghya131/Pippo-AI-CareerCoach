import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

const USER_SYNC_RETRY_DELAYS_MS = [50, 150, 300];

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const findSyncedUser = ({ clerkUserId, email }) =>
  db.user.findFirst({
    where: {
      OR: [{ clerkUserId }, { email }],
    },
  });

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    console.error("Failed to sync Clerk user into Prisma: missing email");
    return null;
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    email.split("@")[0] ||
    "PippoAI User";

  const profileData = {
    clerkUserId: user.id,
    email,
    name,
    imageUrl: user.imageUrl,
  };

  for (let attempt = 0; attempt <= USER_SYNC_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const loggedInUser = await db.user.findUnique({
        where: {
          clerkUserId: user.id,
        },
      });

      if (loggedInUser) {
        if (
          loggedInUser.email === profileData.email &&
          loggedInUser.name === profileData.name &&
          loggedInUser.imageUrl === profileData.imageUrl
        ) {
          return loggedInUser;
        }

        return await db.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            email: profileData.email,
            name: profileData.name,
            imageUrl: profileData.imageUrl,
          },
        });
      }

      const existingUserWithEmail = await db.user.findUnique({
        where: {
          email: profileData.email,
        },
      });

      if (existingUserWithEmail) {
        return await db.user.update({
          where: {
            id: existingUserWithEmail.id,
          },
          data: profileData,
        });
      }

      return await db.user.create({
        data: profileData,
      });
    } catch (error) {
      if (error?.code === "P2002" || error?.code === "P2034") {
        const recoveredUser = await findSyncedUser({
          clerkUserId: user.id,
          email: profileData.email,
        });

        if (recoveredUser) {
          return recoveredUser;
        }

        const delayMs = USER_SYNC_RETRY_DELAYS_MS[attempt];

        if (typeof delayMs === "number") {
          await wait(delayMs);
          continue;
        }
      }

      console.error("Failed to sync Clerk user into Prisma:", error);
      return null;
    }
  }

  const recoveredUser = await findSyncedUser({
    clerkUserId: user.id,
    email: profileData.email,
  });

  if (recoveredUser) {
    return recoveredUser;
  }

  console.error("Failed to sync Clerk user into Prisma: exhausted retries");
  return null;
};
