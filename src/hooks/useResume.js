import { useState, useEffect } from 'react';
import { LocalStorageService, StorageKeys } from '../service/localStorage';
import { AIService } from '../service/ai';

export const useResume = (resumeId) => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resumeId) {
      const resumes = LocalStorageService.get(StorageKeys.RESUMES) || [];
      const found = resumes.find(r => r.id === resumeId);
      setResume(found || null);
      setLoading(false);
    }
  }, [resumeId]);

  const saveResume = (updatedResume) => {
    try {
      LocalStorageService.saveResume(updatedResume);
      setResume(updatedResume);
      return true;
    } catch (error) {
      setError('Failed to save resume');
      return false;
    }
  };

  const enhanceWithAI = async (section, content, apiKey) => {
    try {
      setLoading(true);
      let enhancedContent;

      switch (section) {
        case 'summary':
          enhancedContent = await AIService.generateSummary(
            content.experience,
            content.skills,
            apiKey
          );
          break;
        case 'experience':
          enhancedContent = await AIService.enhanceJobDescription(
            content,
            apiKey
          );
          break;
        case 'skills':
          enhancedContent = await AIService.suggestSkills(
            content,
            apiKey
          );
          break;
        default:
          throw new Error('Invalid section');
      }

      return enhancedContent;
    } catch (error) {
      setError('Failed to enhance content with AI');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    resume,
    loading,
    error,
    saveResume,
    enhanceWithAI
  };
};