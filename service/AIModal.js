import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

if (!apiKey) {
  console.error('Google AI API key is not set. Please set VITE_GOOGLE_AI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", // Using more stable model
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};

const chat = model.startChat({
  generationConfig,
  history: [],
});

export const generateAIContent = async (prompt) => {
  if (!apiKey) {
    throw new Error('Google AI API key is not configured. Please set VITE_GOOGLE_AI_API_KEY in your .env file');
  }

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw new Error('Failed to generate AI content. Please check your API key and try again.');
  }
};