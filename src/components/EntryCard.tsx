import { NextResponse } from "next/server";
import { getUserByClerkId } from "../../utils/auth";
import { prisma } from "../../utils/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { cn } from "@/lib/utils";

const getEntry = async (id: string) => {
  const user = await getUserByClerkId();

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        id,
        userId: user.id,
      },
    },
  });

  if (!entry) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  const analysis = await prisma.analysis.findUnique({
    where: {
      entryId: entry.id,
    },
  });

  console.log("entry", entry);
  console.log("analysis", analysis);

  return { ...entry, analysis };
};

const EntryCard = ({ entry }) => {
  const { subject, color, summary, createdAt } = entry?.analysis;
  const date = new Date(createdAt).toDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <span>{subject}</span>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{summary}</p>
      </CardContent>
    </Card>
  );
};

export default EntryCard;
