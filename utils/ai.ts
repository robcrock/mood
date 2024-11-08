import { OpenAI } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import z from "zod";

const promptSchema = z.object({
  mood: z
    .string()
    .describe("The mood of the person who wrote the journal entry."),
  subject: z.string().describe("The subject of the journal entry."),
  negative: z
    .boolean()
    .describe(
      "Is the journal entry negative? (i.e. Does it contain negative sentiment?)"
    ),
  summary: z.string().describe("Short summary of the entire journal entry."),
  color: z
    .string()
    .describe(
      "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
    ),
});

const parser = new StructuredOutputParser(promptSchema);

const getPrompt = async (journalEntry: string) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({
    entry: journalEntry,
  });

  return input;
};

export const analyze = async (contnet: string) => {
  const prompt = await getPrompt(contnet);
  const model = new OpenAI({
    temperature: 0.25,
    modelName: "gpt-4",
    apiKey: process.env.OPENAI_API_KEY,
  });

  const result = await model.invoke(prompt);

  try {
    return parser.parse(result);
  } catch (error) {
    console.log(error);
    return null;
  }
};
