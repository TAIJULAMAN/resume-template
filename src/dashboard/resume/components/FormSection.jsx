import React, { useState, useContext, useCallback } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home, Sparkles } from 'lucide-react'
import Summery from './forms/Summery'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import { Link } from 'react-router-dom'
import ThemeColor from './ThemeColor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { AIService } from '../../../../service/ai'
import { toast } from 'sonner'

const formSections = [
  { id: 1, title: 'Personal Details', component: PersonalDetail },
  { id: 2, title: 'Summary', component: Summery },
  { id: 3, title: 'Experience', component: Experience },
  { id: 4, title: 'Education', component: Education },
  { id: 5, title: 'Skills', component: Skills }
];

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const [isAILoading, setIsAILoading] = useState(false);
  const { resumeInfo, onSave } = useContext(ResumeInfoContext);

  const handleAIEnhance = useCallback(async () => {
    if (!resumeInfo || !import.meta.env.VITE_OPENAI_API_KEY) {
      toast.error('OpenAI API key is required for AI features');
      return;
    }

    setIsAILoading(true);
    try {
      let updatedContent = {};

      switch (activeFormIndex) {
        case 2: // Summary
          const summary = await AIService.generateSummary(
            resumeInfo.content.experience,
            resumeInfo.content.skills
          );
          updatedContent = { content: { ...resumeInfo.content, summary } };
          break;

        case 3: // Experience
          const lastExp = resumeInfo.content.experience[resumeInfo.content.experience.length - 1];
          if (lastExp) {
            const enhancedDesc = await AIService.enhanceJobDescription(lastExp.description);
            const updatedExperience = resumeInfo.content.experience.map((exp, i) => 
              i === resumeInfo.content.experience.length - 1 
                ? { ...exp, description: enhancedDesc }
                : exp
            );
            updatedContent = { content: { ...resumeInfo.content, experience: updatedExperience } };
          }
          break;

        case 5: // Skills
          const suggestedSkills = await AIService.suggestSkills(
            resumeInfo.content.experience.map(exp => exp.description).join(' ')
          );
          const newSkills = [...new Set([
            ...resumeInfo.content.skills,
            ...suggestedSkills.split(',').map(s => s.trim())
          ])];
          updatedContent = { content: { ...resumeInfo.content, skills: newSkills } };
          break;
      }

      if (Object.keys(updatedContent).length > 0) {
        await onSave(updatedContent);
        toast.success('Content enhanced with AI');
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance content with AI');
    } finally {
      setIsAILoading(false);
    }
  }, [activeFormIndex, resumeInfo, onSave]);

  const CurrentForm = formSections.find(section => section.id === activeFormIndex)?.component;

  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <div className='flex gap-5'>
          <Link to="/dashboard">
            <Button variant="outline"><Home className="w-4 h-4" /></Button>
          </Link>
          <ThemeColor />
        </div>
        <div className='flex items-center gap-2'>
          {[2, 3, 5].includes(activeFormIndex) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIEnhance}
              disabled={isAILoading}
            >
              {isAILoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Enhance with AI
            </Button>
          )}
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveFormIndex(prev => prev - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            size="sm"
            disabled={!enableNext}
            onClick={() => setActiveFormIndex(prev => 
              prev < formSections.length ? prev + 1 : prev
            )}
          >
            {activeFormIndex === formSections.length ? 'Finish' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {formSections.find(section => section.id === activeFormIndex)?.title}
        </h2>
        {CurrentForm && (
          <CurrentForm
            enabledNext={setEnableNext}
          />
        )}
      </div>
    </div>
  )
}

export default FormSection