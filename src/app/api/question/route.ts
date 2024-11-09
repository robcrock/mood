import { NextRequest, NextResponse } from "next/server";
import { getUserByClerkId } from "../../../../utils/auth";
import { prisma } from "../../../../utils/db";
import { qa } from "../../../../utils/ai";

export const POST = async (request: NextRequest) => {
  const { question } = await request.json();
  const user = await getUserByClerkId();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  const answer = await qa(question, entries);

  return NextResponse.json({ data: answer });
};
