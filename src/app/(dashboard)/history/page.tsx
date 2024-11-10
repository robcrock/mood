import HistoryChart from "@/components/HistoryChart";
import { getUserByClerkId } from "../../../../utils/auth";
import { prisma } from "../../../../utils/db";

const getData = async () => {
  const user = await getUserByClerkId();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const sum = analyses.reduce(
    (acc, { sentimentScore }) => acc + sentimentScore,
    0
  );
  const avg = Math.round(sum / analyses.length);
  return { analyses, avg };
};

const HistoryPage = async () => {
  const { analyses, avg } = await getData();

  console.log(analyses);
  return (
    <div className="w-full h-full">
      <h1>{`Avg. Sentiment ${avg}`}</h1>
      <div className="w-full h-full">
        <HistoryChart data={analyses} />
      </div>
    </div>
  );
};

export default HistoryPage;
