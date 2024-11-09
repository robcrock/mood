"use client";

import { useState } from "react";
import { askQuestion } from "../../utils/api";
import Spinner from "./Spinner";

const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    // do things here
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const answer = await askQuestion(value);
    setResponse(answer.data);
    setLoading(false);
    setValue("");
    console.log("answer", answer);
  };

  console.log("response", response);
  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <input
          disabled={loading}
          className="px-4 py-2 mr-2 text-lg border rounded-lg border-black/20"
          onChange={handleChange}
          value={value}
          type="text"
          placeholder="Ask a question"
        />
        <button
          disabled={loading}
          className="px-4 py-2 text-lg bg-blue-400 rounded-lg"
          type="submit"
        >
          Ask
        </button>
      </form>
      {loading && <Spinner />}
      {response && <div>{response}</div>}
    </div>
  );
};

export default Question;