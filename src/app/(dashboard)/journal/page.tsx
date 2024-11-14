import EntryCard from "@/components/EntryCard";
import { getUserByClerkId } from "../../../../utils/auth";
import { prisma } from "../../../../utils/db";
import NewEntryButton from "@/components/NewEntryButton";
import Link from "next/link";
import Question from "@/components/Question";
import { StickyHeader } from "@/components/StickyHeader";

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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto bg-white">
        <StickyHeader>
          <div className="px-10 mb-8">
            <h2 className="mb-8 text-3xl">Journal</h2>
            <div className="flex justify-between gap-4 ">
              <Question />
            </div>
          </div>
        </StickyHeader>
        <div className="px-10">
          <div className="grid grid-cols-3 gap-4">
            {entries.map((entry) => (
              <Link key={entry.id} href={`/journal/${entry.id}`}>
                <EntryCard entry={entry} />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-10 right-10">
        <NewEntryButton />
      </div>
    </div>
  );
}
