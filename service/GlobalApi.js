const STORAGE_KEY = 'resumes';

const GlobalApi = {
  GetUserResumes() {
    try {
      const resumes = localStorage.getItem(STORAGE_KEY);
      return resumes ? JSON.parse(resumes) : [];
    } catch (error) {
      console.error('Error getting resumes:', error);
      return [];
    }
  },

  GetResumeById(id) {
    try {
      const resumes = this.GetUserResumes();
      return resumes.find(resume => resume.id === id) || null;
    } catch (error) {
      console.error('Error getting resume by id:', error);
      return null;
    }
  },

  CreateNewResume(data) {
    try {
      const resumes = this.GetUserResumes();
      const newResume = {
        id: crypto.randomUUID(), // Ensure unique ID
        title: data.title || 'Untitled Resume',
        content: {
          personalDetails: {},
          experience: [],
          education: [],
          skills: [],
          summary: '',
          ...data.content
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      resumes.push(newResume);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return newResume;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw new Error('Failed to create resume');
    }
  },

  UpdateResumeDetail(id, data) {
    try {
      const resumes = this.GetUserResumes();
      const index = resumes.findIndex(resume => resume.id === id);
      
      if (index === -1) {
        throw new Error('Resume not found');
      }

      const updatedResume = {
        ...resumes[index],
        ...data,
        updatedAt: new Date().toISOString()
      };

      resumes[index] = updatedResume;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
      return updatedResume;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw new Error('Failed to update resume');
    }
  },

  DeleteResume(id) {
    try {
      const resumes = this.GetUserResumes();
      const filteredResumes = resumes.filter(resume => resume.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredResumes));
      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw new Error('Failed to delete resume');
    }
  }
};

export default GlobalApi;