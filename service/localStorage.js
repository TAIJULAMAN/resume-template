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