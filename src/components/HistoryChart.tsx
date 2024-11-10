"use client";

import { ResponsiveContainer, Line, XAxis, Tooltip, LineChart } from "recharts";

const CustomTooltip = ({ payload, label, active }) => {
  const dateLabel = new Date(label).toLocaleString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  if (active) {
    const analysis = payload[0].payload;
    return (
      <div className="relative p-8 border rounded-lg shadow-md custom-tooltip bg-white/5 border-black/10 backdrop-blur-md">
        <div
          className="absolute w-2 h-2 rounded-full left-2 top-2"
          style={{ background: analysis.color }}
        ></div>
        <p className="text-sm label text-black/30">{dateLabel}</p>
        <p className="text-xl uppercase intro">{analysis.mood}</p>
      </div>
    );
  }

  return null;
};

const HistoryChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart width={300} height={100} data={data}>
        <Line
          type="monotone"
          dataKey="sentimentScore"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <XAxis dataKey="createdAt" />
        <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
