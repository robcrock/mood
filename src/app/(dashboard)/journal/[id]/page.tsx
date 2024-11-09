import Editor from "@/components/Editor";
import { getUserByClerkId } from "../../../../../utils/auth";
import { prisma } from "../../../../../utils/db";

// Update getEntry to handle Promise params
const getEntry = async (id: string) => {
  const user = await getUserByClerkId();
  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

// Update PageProps to reflect that params is a Promise
type PageProps = {
  params: {
    id: string;
  };
};

export default async function JournalEditorPage({ params }: PageProps) {
  const entry = await getEntry(params.id);

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <div className="grid w-full h-full">
      <Editor entry={entry} />
    </div>
  );
}
