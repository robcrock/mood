import Editor from "@/components/Editor";
import { getUserByClerkId } from "../../../../../utils/auth";
import { prisma } from "../../../../../utils/db";

type JournalEntry = {
  id: string;
  content: string;
  userId: string;
  // Add other entry fields as needed
};

// Update getEntry to handle Promise params
const getEntry = async (
  params: Promise<{ id: string }>
): Promise<JournalEntry | null> => {
  // Await the params to get the id
  const { id } = await params;

  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
  });

  return entry;
};

// Update PageProps to reflect that params is a Promise
type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JournalPage({ params }: PageProps) {
  const entry = await getEntry(params);

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  );
}
