const STORAGE_KEY = 'resumes';

const GlobalApi = {
  GetUserResumes() {
    return new Promise((resolve, reject) => {
      try {
        const resumes = localStorage.getItem(STORAGE_KEY);
        resolve(resumes ? JSON.parse(resumes) : []);
      } catch (error) {
        console.error('Error getting resumes:', error);
        reject(error);
      }
    });
  },

  GetResumeById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const resumes = await this.GetUserResumes();
        resolve(resumes.find(resume => resume.id === id) || null);
      } catch (error) {
        console.error('Error getting resume by id:', error);
        reject(error);
      }
    });
  },

  CreateNewResume(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const resumes = await this.GetUserResumes();
        const newResume = {
          id: crypto.randomUUID(),
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
        resolve(newResume);
      } catch (error) {
        console.error('Error creating resume:', error);
        reject(new Error('Failed to create resume'));
      }
    });
  },

  UpdateResumeDetail(id, data) {
    return new Promise(async (resolve, reject) => {
      try {
        const resumes = await this.GetUserResumes();
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
        resolve(updatedResume);
      } catch (error) {
        console.error('Error updating resume:', error);
        reject(new Error('Failed to update resume'));
      }
    });
  },

  DeleteResume(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const resumes = await this.GetUserResumes();
        const filteredResumes = resumes.filter(resume => resume.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredResumes));
        resolve(true);
      } catch (error) {
        console.error('Error deleting resume:', error);
        reject(new Error('Failed to delete resume'));
      }
    });
  }
};

export default GlobalApi;