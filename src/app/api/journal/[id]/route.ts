import { NextResponse } from "next/server";
import { getUserByClerkId } from "../../../../../utils/auth";
import { prisma } from "../../../../../utils/db";
import { analyze } from "../../../../../utils/ai";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using them
    const { id } = await context.params;
    const { content } = await request.json();
    const user = await getUserByClerkId();

    const updatedEntry = await prisma.journalEntry.update({
      where: {
        userId_id: {
          id,
          userId: user.id,
        },
      },
      data: {
        content,
      },
    });

    const analysis = await analyze(updatedEntry.content);
    await prisma.analysis.upsert({
      where: {
        entryId: updatedEntry.id,
      },
      create: {
        entryId: updatedEntry.id,
        mood: analysis?.mood || "",
        subject: analysis?.subject || "",
        negative: analysis?.negative || false,
        color: analysis?.color || "",
        summary: analysis?.summary || "",
      },
      update: {
        mood: analysis?.mood || "",
        subject: analysis?.subject || "",
        negative: analysis?.negative || false,
        color: analysis?.color || "",
        summary: analysis?.summary || "",
      },
    });

    return NextResponse.json({ data: { ...updatedEntry, analysis } });
  } catch (error) {
    console.error("PATCH handler error:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
