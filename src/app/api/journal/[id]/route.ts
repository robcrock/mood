import { NextResponse } from "next/server";
import { getUserByClerkId } from "../../../../../utils/auth";
import { prisma } from "../../../../../utils/db";

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

    return NextResponse.json({ data: updatedEntry });
  } catch (error) {
    console.error("PATCH handler error:", error);
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 }
    );
  }
}
