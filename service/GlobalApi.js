// service/ai.js
export const AIService = {
    generateContent: async (prompt, apiKey) => {
        try {
            const response = await fetch('https://api.openai.com/v1/completions', {
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
                            content: 'You are a professional resume writer helping to create compelling content.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error generating AI content:', error);
            throw error;
        }
    },

    // Generate summary
    generateSummary: async (experience, skills, apiKey) => {
        const prompt = `Create a professional summary based on the following experience and skills:
      Experience: ${experience}
      Skills: ${skills}
      Keep it concise and impactful.`;
        return AIService.generateContent(prompt, apiKey);
    },

    // Enhance job descriptions
    enhanceJobDescription: async (description, apiKey) => {
        const prompt = `Improve the following job description using action verbs and quantifiable achievements:
      ${description}`;
        return AIService.generateContent(prompt, apiKey);
    },

    // Suggest skills based on experience
    suggestSkills: async (experience, apiKey) => {
        const prompt = `Suggest relevant technical and soft skills based on this experience:
      ${experience}`;
        return AIService.generateContent(prompt, apiKey);
    }
};

// service/localStorage.js
export const StorageKeys = {
    RESUMES: 'resumes',
    USER_PREFERENCES: 'user_preferences',
    TEMPLATES: 'resume_templates'
};

export const LocalStorageService = {
    // Save data to localStorage
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Get data from localStorage
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Save a resume
    saveResume: (resume) => {
        const resumes = LocalStorageService.get(StorageKeys.RESUMES) || [];
        const existingIndex = resumes.findIndex(r => r.id === resume.id);

        if (existingIndex >= 0) {
            resumes[existingIndex] = resume;
        } else {
            resumes.push(resume);
        }

        return LocalStorageService.save(StorageKeys.RESUMES, resumes);
    },

    // Get all resumes
    getAllResumes: () => {
        return LocalStorageService.get(StorageKeys.RESUMES) || [];
    },

    // Delete a resume
    deleteResume: (resumeId) => {
        const resumes = LocalStorageService.get(StorageKeys.RESUMES) || [];
        const filteredResumes = resumes.filter(r => r.id !== resumeId);
        return LocalStorageService.save(StorageKeys.RESUMES, filteredResumes);
    },

    // Export all data
    exportData: () => {
        const data = {
            resumes: LocalStorageService.get(StorageKeys.RESUMES),
            preferences: LocalStorageService.get(StorageKeys.USER_PREFERENCES),
            templates: LocalStorageService.get(StorageKeys.TEMPLATES),
            exportDate: new Date().toISOString()
        };
        return data;
    },

    // Import data
    importData: (data) => {
        try {
            LocalStorageService.save(StorageKeys.RESUMES, data.resumes);
            LocalStorageService.save(StorageKeys.USER_PREFERENCES, data.preferences);
            LocalStorageService.save(StorageKeys.TEMPLATES, data.templates);
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// service/GlobalApi.js
const STORAGE_KEY = 'resumes';

const GlobalApi = {
  GetUserResumes: () => {
    try {
      const resumes = localStorage.getItem(STORAGE_KEY);
      return resumes ? JSON.parse(resumes) : [];
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return [];
    }
  },

  GetResumeById: (id) => {
    try {
      const resumes = GlobalApi.GetUserResumes();
      return resumes.find(resume => resume.id === id);
    } catch (error) {
      console.error('Error fetching resume:', error);
      return null;
    }
  },

  CreateNewResume: (data) => {
    try {
      const resumes = GlobalApi.GetUserResumes();
      resumes.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return data;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  },

  UpdateResumeDetail: (id, data) => {
    try {
      const resumes = GlobalApi.GetUserResumes();
      const index = resumes.findIndex(resume => resume.id === id);
      if (index !== -1) {
        resumes[index] = { ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
        return resumes[index];
      }
      throw new Error('Resume not found');
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  },

  DeleteResume: (id) => {
    try {
      const resumes = GlobalApi.GetUserResumes();
      const filteredResumes = resumes.filter(resume => resume.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredResumes));
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }
};

export default GlobalApi;