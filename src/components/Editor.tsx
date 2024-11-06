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
  const [text, setText] = useState(entry.content);
  const [currentEntry, setEntry] = useState<JournalEntry>(entry);
  const [isSaving, setIsSaving] = useState(false);

  if (!entry) {
    return <div>Loading...</div>;
  }

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
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-0 left-0 z-10 p-2">
        {isSaving ? (
          <div>...saving</div>
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="h-full">
        <textarea
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setText(e.target.value)
          }
          className="box-border w-full h-full p-8 text-xl resize-none"
        />
      </div>
    </div>
  );
};

export default Editor;
