import React, { useState, useContext } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home, Sparkles } from 'lucide-react'
import Summery from './forms/Summery'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ThemeColor from './ThemeColor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
// import { AIService } from '../../'
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
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { resumeInfo, setResumeInfo, onSave } = useContext(ResumeInfoContext);

  const handleAIEnhance = async () => {
    if (!resumeInfo || !process.env.VITE_OPENAI_API_KEY) {
      toast.error('OpenAI API key is required for AI features');
      return;
    }

    setIsAILoading(true);
    try {
      let enhancedContent;
      switch (activeFormIndex) {
        case 2: // Summary
          enhancedContent = await AIService.generateSummary(
            resumeInfo.content.experience,
            resumeInfo.content.skills,
            process.env.VITE_OPENAI_API_KEY
          );
          if (enhancedContent) {
            const updatedInfo = {
              ...resumeInfo,
              content: {
                ...resumeInfo.content,
                summary: enhancedContent
              }
            };
            await onSave(updatedInfo);
            setResumeInfo(updatedInfo);
          }
          break;
        case 3: // Experience
          const lastExperience = resumeInfo.content.experience[resumeInfo.content.experience.length - 1];
          if (lastExperience) {
            enhancedContent = await AIService.enhanceJobDescription(
              lastExperience.description,
              process.env.VITE_OPENAI_API_KEY
            );
            if (enhancedContent) {
              const updatedExperience = {
                ...lastExperience,
                description: enhancedContent
              };
              const updatedInfo = {
                ...resumeInfo,
                content: {
                  ...resumeInfo.content,
                  experience: [
                    ...resumeInfo.content.experience.slice(0, -1),
                    updatedExperience
                  ]
                }
              };
              await onSave(updatedInfo);
              setResumeInfo(updatedInfo);
            }
          }
          break;
        case 5: // Skills
          enhancedContent = await AIService.suggestSkills(
            resumeInfo.content.experience.map(exp => exp.description).join(' '),
            process.env.VITE_OPENAI_API_KEY
          );
          if (enhancedContent) {
            const updatedInfo = {
              ...resumeInfo,
              content: {
                ...resumeInfo.content,
                skills: [...new Set([...resumeInfo.content.skills, ...enhancedContent.split(',').map(s => s.trim())])]
              }
            };
            await onSave(updatedInfo);
            setResumeInfo(updatedInfo);
          }
          break;
      }
      toast.success('Content enhanced with AI');
    } catch (error) {
      console.error('AI enhancement error:', error);
      toast.error('Failed to enhance content with AI');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleNext = () => {
    if (activeFormIndex < formSections.length) {
      setActiveFormIndex(activeFormIndex + 1);
    } else {
      navigate(`/my-resume/${resumeId}/view`);
    }
  };

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
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            size="sm"
            disabled={!enableNext}
            onClick={handleNext}
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
            enabledNext={(v) => setEnableNext(v)}
          />
        )}
      </div>
    </div>
  )
}

export default FormSection