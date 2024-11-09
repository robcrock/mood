"use client";

import { useState } from "react";
import { useAutosave } from "react-autosave";
import { updateEntry } from "../../utils/api";
import Spinner from "./Spinner";

const Editor = ({ entry }) => {
  const [text, setText] = useState(entry.content);
  const [currentEntry, setEntry] = useState(entry);
  const [isSaving, setIsSaving] = useState(false);

  const analysis = currentEntry.analysis || {};

  useAutosave({
    data: text,
    onSave: async (_text) => {
      if (_text === entry.content) return;
      setIsSaving(true);

      try {
        const data = await updateEntry(entry.id, _text);
        // Update the entire entry with the new data
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
    <div className="grid w-full h-full grid-cols-3 divide-x">
      {/* Textarea section - spans 2 columns */}
      <div className="relative h-full col-span-2">
        <div className="absolute top-0 left-0 z-10 p-2">
          {isSaving ? (
            <Spinner />
          ) : (
            <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full p-8 text-xl border-none resize-none focus:ring-0 focus:outline-none"
        />
      </div>

      {/* Analysis section - spans 1 column */}
      <div className="col-span-1">
        <div
          style={{ background: analysis.color || "#ffffff" }}
          className="h-[100px] text-white p-8"
        >
          <h2 className="inline-block px-2 py-1 text-2xl text-black rounded bg-white/25">
            Analysis
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { label: "Subject", value: analysis.subject || "" },
            { label: "Mood", value: analysis.mood || "" },
            {
              label: "Negative",
              value: analysis.negative ? "True" : "False",
            },
            {
              label: "Summary",
              value: analysis.summary || "",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-8 py-4"
            >
              <div className="text-xl font-semibold">{item.label}</div>
              <div className="text-xl">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editor;
