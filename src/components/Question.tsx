"use client";

import { useState } from "react";
import { askQuestion } from "../../utils/api";
import Spinner from "./Spinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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
    <div className="w-full">
      <form action="" onSubmit={handleSubmit} className="flex gap-1">
        <Input
          disabled={loading}
          className="w-full px-4 py-2 mr-2 text-lg border rounded-lg border-black/20"
          onChange={handleChange}
          value={value}
          type="text"
          placeholder="Pose a question to you Journal..."
        />
        <Button disabled={loading} type="submit">
          Ask
        </Button>
      </form>
      {loading && <Spinner />}
      {response && <div>{response}</div>}
    </div>
  );
};

export default Question;
