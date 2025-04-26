export class AIService {
  static async generateSummary(experience, skills) {
    const prompt = `Create a professional resume summary based on the following experience and skills:
    
Experience:
${experience.map(exp => `- ${exp.title} at ${exp.company}: ${exp.description}`).join('\n')}

Skills:
${skills.join(', ')}

Write a concise, impactful professional summary in first person that highlights my key achievements and skills.`;

    return this.callOpenAI(prompt);
  }

  static async enhanceJobDescription(description) {
    const prompt = `Enhance the following job description with strong action verbs and quantifiable achievements. Make it more impactful and professional:

${description}

Rewrite this using:
1. Strong action verbs
2. Specific metrics and numbers where possible
3. Clear outcomes and achievements
4. Professional tone`;

    return this.callOpenAI(prompt);
  }

  static async suggestSkills(experience) {
    const prompt = `Based on the following job experience, suggest relevant technical and soft skills that should be included in a resume:

${experience}

Return only a comma-separated list of skills, no explanations.`;

    return this.callOpenAI(prompt);
  }

  static async callOpenAI(prompt) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
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
}