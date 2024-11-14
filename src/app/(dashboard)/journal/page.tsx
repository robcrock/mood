import EntryCard from "@/components/EntryCard";
import { getUserByClerkId } from "../../../../utils/auth";
import { prisma } from "../../../../utils/db";
import NewEntryCard from "@/components/NewEntryCard";
import Link from "next/link";
import Question from "@/components/Question";

const getEntries = async () => {
  const user = await getUserByClerkId();
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    include: {
      analysis: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries;
};

export default async function JournalPage() {
  const entries = await getEntries();

  return (
    <div className="h-full p-10">
      <h2 className="mb-8 text-3xl">Journal</h2>
      <div className="flex justify-between gap-4 mb-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
      <div className="absolute right-10 bottom-10">
        <NewEntryCard />
      </div>
    </div>
  );
}
