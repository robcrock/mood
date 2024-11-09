// Import statements for external dependencies
import { OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import z from "zod";

import { Document } from "@langchain/core/documents";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

/**
 * Schema Definition
 * Defines the structure for parsing journal entries into meaningful data
 * Each field represents a different aspect of the journal entry analysis
 */
const promptSchema = z.object({
  // Emotional analysis fields
  mood: z
    .string()
    .describe("The mood of the person who wrote the journal entry."),
  color: z
    .string()
    .describe(
      "a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness."
    ),

  // Content analysis fields
  subject: z.string().describe("The subject of the journal entry."),
  summary: z.string().describe("Short summary of the entire journal entry."),

  // Sentiment analysis field
  negative: z
    .boolean()
    .describe(
      "Is the journal entry negative? (i.e. Does it contain negative sentiment?)"
    ),
});

// Initialize the parser with our schema
const parser = new StructuredOutputParser(promptSchema);

/**
 * Constructs the prompt for the AI model
 * @param {string} journalEntry - The raw journal entry text to be analyzed
 * @returns {Promise<string>} Formatted prompt string
 */
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

/**
 * Main analysis function
 * Processes a journal entry through the OpenAI model and returns structured data
 * @param {string} contnet - The journal entry content to analyze
 * @returns {Promise<Object|null>} Parsed analysis results or null if parsing fails
 */
export const analyze = async (contnet: string) => {
  // Generate the formatted prompt
  const prompt = await getPrompt(contnet);

  // Initialize the OpenAI model with specific configuration
  const model = new OpenAI({
    temperature: 0.25, // Lower temperature for more consistent results
    modelName: "gpt-4",
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Get the model's response
  const result = await model.invoke(prompt);

  // Attempt to parse the result into our schema
  try {
    return parser.parse(result);
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Function that answers questions based on journal entries
 * @param {string} question - The question to be answered
 * @param {Array} entries - Array of journal entries to search through
 */
export const qa = async (question, entries) => {
  // Convert journal entries into Document objects that the AI can process
  // Each document contains the entry's content and metadata (ID and creation date)
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    });
  });

  // Set up the AI model (GPT-4)
  // Temperature of 0 means it will give consistent, focused answers
  const model = new OpenAI({
    temperature: 0,
    modelName: "gpt-4",
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Create a chain that will refine answers by looking at multiple documents
  const chain = loadQARefineChain(model);

  // Set up the embedding system that converts text into numerical vectors
  // This allows us to find similar pieces of text
  const embeddings = new OpenAIEmbeddings();

  // Create a searchable database from our documents using the embedding system
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  // Search through our database to find journal entries most relevant to the question
  const relevantDocs = await store.similaritySearch(question);

  // Use the AI model to generate an answer based on the relevant documents
  const res = await chain.invoke({
    input_documents: relevantDocs, // The relevant journal entries we found
    question, // The original question
  });

  // Return just the text of the answer
  return res.output_text;
};
