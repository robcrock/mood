import { getUserByClerkId } from "../../../../utils/auth";
import { prisma } from "../../../../utils/db";

const getEntries = async () => {
  const user = await getUserByClerkId();
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries;
};

export default async function JournalPage() {
  const entries = await getEntries();

  console.log(entries);
  return (
    <div>
      <h1>Journal</h1>
      <p>Journal page content</p>
    </div>
  );
}
