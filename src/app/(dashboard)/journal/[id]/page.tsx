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
  const { summary, subject, mood, negative, color } = entry?.analysis;

  const anaysisData = [
    { name: "Summary", value: summary },
    { name: "Subject", value: subject },
    { name: "Mood", value: mood },
    { name: "Negative", value: negative ? "True" : "False" },
  ];

  if (!entry) {
    return <div>Entry not found</div>;
  }

  return (
    <div className="grid w-full h-full grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="col-span-1 border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {anaysisData.map((item) => {
              return (
                <li
                  key={item.name}
                  className="flex items-center justify-between px-2 py-4 border-t border-b border-black/10"
                >
                  <span className="text-lg font-semibold">{item.name}:</span>
                  <span>{item.value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
