const EntryCard = ({ entry }) => {
  const date = new Date(entry.createdAt).toDateString();
  return (
    <div className="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
      <div className="px-4 py-5">{date}</div>
      {/* <div className="px-4 py-5">{entry.analysis.summary}</div>
      <div className="px-4 py-4">{entry.analysis.mood}</div> */}
      <div className="px-4 py-5">summary</div>
      <div className="px-4 py-4">mood</div>
    </div>
  );
};

export default EntryCard;
