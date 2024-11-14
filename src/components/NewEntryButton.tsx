"use client";

// import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { createNewEntry } from "../../utils/api";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const NewEntryButton = () => {
  const router = useRouter();

  const handleOnClick = async () => {
    const data = await createNewEntry();
    router.push(`/journal/${data.id}`);
  };

  return (
    <Button
      size="icon"
      onClick={handleOnClick}
      className="rounded-full shadow-md shadow-black/50"
    >
      <Plus />
    </Button>
  );
};

export default NewEntryButton;
