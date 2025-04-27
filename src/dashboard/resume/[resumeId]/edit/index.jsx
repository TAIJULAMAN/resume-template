import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormSection from '../../components/FormSection'
import ResumePreview from '../../components/ResumePreview'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from '../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { exportToPDF } from '@/utils/export'

function EditResume() {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [resumeInfo, setResumeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveTimeout, setSaveTimeout] = useState(null);
    const previewRef = React.useRef(null);

    useEffect(() => {
        getResumeInfo();
        return () => {
            if (saveTimeout) clearTimeout(saveTimeout);
        };
    }, [resumeId]);

    const getResumeInfo = () => {
        try {
            const storedResume = localStorage.getItem(`resume-${resumeId}`);
            if (storedResume) {
                const parsedResume = JSON.parse(storedResume);
                // Ensure proper data structure
                const formattedResume = {
                    id: parsedResume.id || resumeId,
                    title: parsedResume.title || 'Untitled Resume',
                    createdAt: parsedResume.createdAt || new Date().toISOString(),
                    updatedAt: parsedResume.updatedAt || new Date().toISOString(),
                    themeColor: parsedResume.themeColor || '#2563eb',
                    content: {
                        personalDetails: parsedResume.content?.personalDetails || {},
                        summary: parsedResume.content?.summary || '',
                        experience: parsedResume.content?.experience || [],
                        education: parsedResume.content?.education || [],
                        skills: parsedResume.content?.skills || []
                    }
                };
                setResumeInfo(formattedResume);
                setLoading(false);
                return;
            }

            // Create new resume if none exists
            const newResume = {
                id: resumeId,
                title: 'Untitled Resume',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                themeColor: '#2563eb',
                content: {
                    personalDetails: {},
                    summary: '',
                    experience: [],
                    education: [],
                    skills: []
                }
            };
            setResumeInfo(newResume);
            localStorage.setItem(`resume-${resumeId}`, JSON.stringify(newResume));
        } catch (error) {
            console.error('Error fetching resume:', error);
            toast.error('Failed to load resume');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = useCallback(async (updatedInfo) => {
        if (saveTimeout) clearTimeout(saveTimeout);

        const newResumeInfo = {
            ...resumeInfo,
            ...updatedInfo,
            updatedAt: new Date().toISOString()
        };

        // Update state immediately
        setResumeInfo(newResumeInfo);

        // Debounce the save operation
        const timeoutId = setTimeout(() => {
            try {
                // Save to localStorage
                localStorage.setItem(`resume-${resumeId}`, JSON.stringify(newResumeInfo));
                // Optional: Save to backend if needed
                // await GlobalApi.UpdateResumeDetail(resumeId, newResumeInfo);
            } catch (error) {
                console.error('Error saving resume:', error);
                toast.error('Failed to save changes');
            }
        }, 1000);

        setSaveTimeout(timeoutId);
    }, [resumeId, resumeInfo, saveTimeout]);

    const handleExport = async () => {
        if (!previewRef.current || !resumeInfo) return;
        try {
            await exportToPDF(previewRef.current, `${resumeInfo.title || 'resume'}.pdf`);
            toast.success('PDF exported successfully');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export PDF');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>;
    }

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo, onSave: handleSave }}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">{resumeInfo?.title || 'Resume Editor'}</h1>
                    <Button onClick={handleExport} className="gap-2">
                        <Download className="w-4 h-4" />
                        Export PDF
                    </Button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                    <FormSection />
                    <div className="sticky top-4" ref={previewRef}>
                        <ResumePreview />
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume;