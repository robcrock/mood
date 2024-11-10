import { NextResponse } from "next/server";
import { getUserByClerkId } from "../../../../utils/auth";
import { prisma } from "../../../../utils/db";
import { revalidatePath } from "next/cache";
import { analyze } from "../../../../utils/ai";

export const POST = async () => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: "Write about your day!",
    },
  });

  const analysis = await analyze(entry.content);
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      mood: analysis?.mood || "",
      subject: analysis?.subject || "",
      negative: analysis?.negative || false,
      sentimentScore: analysis?.sentimentScore || "",
      color: analysis?.color || "",
      summary: analysis?.summary || "",
    },
  });

  revalidatePath("/journal");

  return NextResponse.json({ data: entry });
};
