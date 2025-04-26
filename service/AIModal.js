import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

class AIService {
  static async generateContent(prompt) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume writer with expertise in creating impactful content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error('AI service request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate content');
    }
  }

  static async sendMessage(prompt) {
    try {
      const text = await this.generateContent(prompt);
      return {
        response: {
          text: () => text
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

export const AIChatSession = AIService;