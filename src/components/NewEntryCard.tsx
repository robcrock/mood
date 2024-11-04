"use client";

// import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { createNewEntry } from "../../utils/api";

const NewEntry = () => {
  const router = useRouter();

  const handleOnClick = async () => {
    const data = await createNewEntry();
    router.push(`/journal/${data.id}`);
  };

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow cursor-pointer">
      <div className="px-4 py-5 sm:p-6" onClick={handleOnClick}>
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  );
};

export default NewEntry;
