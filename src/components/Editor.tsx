"use client";
import { useState } from "react";
import { useAutosave } from "react-autosave";
import { updateEntry } from "../../utils/api";

// Define the entry type
type JournalEntry = {
  id: string;
  content: string;
  userId: string;
  // Add any other properties your entry has
};

// Define props type for the Editor component
type EditorProps = {
  entry: JournalEntry;
};

const Editor = ({ entry }: EditorProps) => {
  if (!entry) {
    return <div>Loading...</div>;
  }

  const [text, setText] = useState(entry.content);
  const [currentEntry, setEntry] = useState<JournalEntry>(entry);
  const [isSaving, setIsSaving] = useState(false);

  useAutosave({
    data: text,
    onSave: async (_text: string) => {
      if (_text === entry.content) return;
      setIsSaving(true);

      try {
        const data = await updateEntry(entry.id, _text);
        setEntry(data);
      } catch (error) {
        console.error("Failed to save:", error);
      } finally {
        setIsSaving(false);
      }
    },
    interval: 1000,
  });

  return (
    <div className="relative grid w-full h-full grid-cols-3 gap-0">
      <div className="absolute top-0 left-0 p-2">
        {isSaving ? (
          <div>...saving</div>
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="col-span-2">
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          className="w-full h-full p-8 text-xl"
        />
      </div>
    </div>
  );
};

export default Editor;
