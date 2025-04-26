import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIService } from './../../../../../service/ai';

function Summary({enabledNext}) {
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const params = useParams();

    useEffect(() => {
        if (resumeInfo?.summary) {
            setSummary(resumeInfo.summary);
        }
    }, [resumeInfo]);

    const generateSummaryFromAI = async (level = 'mid') => {
        if (!resumeInfo?.jobTitle) {
            toast.error('Please enter a job title first');
            return;
        }

        setAiLoading(true);
        try {
            // Create a mock experience entry based on the job title and level
            const mockExperience = [{
                title: resumeInfo.jobTitle,
                company: "Previous Company",
                description: `${level === 'entry' ? 'Entry-level' : 'Experienced'} professional with strong foundation in ${resumeInfo.jobTitle} role.`
            }];

            // Use some default skills based on the job title
            const defaultSkills = ['Communication', 'Problem Solving', 'Team Collaboration', resumeInfo.jobTitle + ' fundamentals'];

            const generatedSummary = await AIService.generateSummary(mockExperience, defaultSkills);
            
            setSummary(generatedSummary);
            setResumeInfo(prev => ({
                ...prev,
                summary: generatedSummary
            }));
            toast.success('Summary generated successfully');
        } catch (error) {
            console.error('Error generating summary:', error);
            if (error.message.includes('API key')) {
                toast.error('Please configure your OpenAI API key in the .env file');
            } else {
                toast.error('Failed to generate summary. Please try again.');
            }
        } finally {
            setAiLoading(false);
        }
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await GlobalApi.UpdateResumeDetail(params?.resumeId, {
                summary: summary
            });
            enabledNext(true);
            toast.success('Summary updated successfully');
        } catch (error) {
            console.error('Error updating summary:', error);
            toast.error('Failed to update summary');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSummary(value);
        setResumeInfo(prev => ({
            ...prev,
            summary: value
        }));
        enabledNext(false);
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-lg'>Professional Summary</h2>
                    <p>Write a brief summary of your professional background</p>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant="outline"
                        onClick={() => generateSummaryFromAI('entry')}
                        disabled={aiLoading}
                    >
                        {aiLoading ? <LoaderCircle className='animate-spin mr-2' /> : <Brain className='mr-2' />}
                        Entry Level
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => generateSummaryFromAI('mid')}
                        disabled={aiLoading}
                    >
                        {aiLoading ? <LoaderCircle className='animate-spin mr-2' /> : <Brain className='mr-2' />}
                        Mid Level
                    </Button>
                </div>
            </div>

            <form onSubmit={onSave} className='mt-5'>
                <Textarea
                    placeholder="Write your professional summary here..."
                    value={summary}
                    onChange={handleInputChange}
                    className='min-h-[200px]'
                />
                <div className='mt-5 flex justify-end'>
                    <Button
                        type="submit"
                        disabled={loading || !summary}
                    >
                        {loading ? <LoaderCircle className='animate-spin mr-2' /> : 'Save & Continue'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Summary;