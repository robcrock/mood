import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export const getUserByClerkId = async (
  params: {
    select?: Prisma.UserSelect;
    include?: Prisma.UserInclude;
  } = {}
) => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { select, include } = params;

  return await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: user.id,
    },
    ...(select && { select }),
    ...(include && { include }),
  });
};
