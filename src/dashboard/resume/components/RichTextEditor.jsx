import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

const PROMPT = 'position title: {positionTitle} , Depends on position title give me 5-7 bullet points for my experience in resume (Please do not add experience level and No JSON array) , give me result in HTML tags';

function RichTextEditor({ onChange, index, defaultValue, experienceTitle }) {
    const [value, setValue] = useState(defaultValue || '');
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [loading, setLoading] = useState(false);

    const generateSummaryFromAI = async () => {
        const title = experienceTitle || resumeInfo?.Experience?.[index]?.title;
        
        if (!title) {
            toast.error('Please add a job title first');
            return;
        }

        setLoading(true);
        try {
            const prompt = PROMPT.replace('{positionTitle}', title);
            const result = await AIChatSession.sendMessage(prompt);
            const generatedContent = await result.response.text();
            const cleanContent = generatedContent.replace('[', '').replace(']', '');
            setValue(cleanContent);
            onChange?.({ target: { value: cleanContent } });
            toast.success('Content generated successfully');
        } catch (error) {
            console.error('Error generating content:', error);
            toast.error('Failed to generate content');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange?.({ target: { value: newValue } });
    };

    return (
        <div>
            <div className='flex justify-between my-2'>
                <label className='text-xs'>Summary</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSummaryFromAI}
                    disabled={loading}
                    className="border-primary text-primary"
                >
                    {loading ? (
                        <LoaderCircle className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                        <>
                            <Brain className='h-4 w-4 mr-2' /> Generate from AI
                        </>
                    )}
                </Button>
            </div>
            <EditorProvider>
                <Editor
                    value={value}
                    onChange={handleChange}
                    className="min-h-[200px] border rounded-lg p-2"
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}

export default RichTextEditor;