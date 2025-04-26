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
                setResumeInfo(JSON.parse(storedResume));
                setLoading(false);
                return;
            }
            const resume = GlobalApi.GetResumeById(resumeId);
            if (!resume) {
                toast.error('Resume not found');
                navigate('/dashboard');
                return;
            }
            setResumeInfo(resume);
        } catch (error) {
            console.error('Error fetching resume:', error);
            toast.error('Failed to load resume');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = useCallback(async (updatedInfo) => {
        // Clear any pending save timeouts
        if (saveTimeout) clearTimeout(saveTimeout);

        // Update state immediately for responsive UI
        setResumeInfo(prevInfo => ({ ...prevInfo, ...updatedInfo }));

        // Debounce the save operation
        const timeoutId = setTimeout(async () => {
            try {
                const finalUpdatedResume = {
                    ...resumeInfo,
                    ...updatedInfo,
                    updatedAt: new Date().toISOString()
                };

                // Save to localStorage first (faster)
                localStorage.setItem(`resume-${resumeId}`, JSON.stringify(finalUpdatedResume));

                // Then update via API
                await GlobalApi.UpdateResumeDetail(resumeId, finalUpdatedResume);
            } catch (error) {
                console.error('Error saving resume:', error);
                toast.error('Failed to save changes');
            }
        }, 1000); // Debounce for 1 second

        setSaveTimeout(timeoutId);
    }, [resumeId, resumeInfo, saveTimeout]);

    const handleExport = async () => {
        if (!previewRef.current) return;
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
                    <div ref={previewRef}>
                        <ResumePreview />
                    </div>
                </div>
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default EditResume