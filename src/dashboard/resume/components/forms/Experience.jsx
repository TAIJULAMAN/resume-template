import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle, Plus } from 'lucide-react'

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummery: '',
}

function Experience({enabledNext}) {
    const [experienceList, setExperienceList] = useState([]);
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize with existing experience or empty array
        setExperienceList(resumeInfo?.Experience || []);
    }, [resumeInfo?.Experience]);

    const handleChange = (index, event) => {
        const {name, value} = event.target;
        setExperienceList(prevList => {
            const newList = [...prevList];
            newList[index] = {
                ...newList[index],
                [name]: value
            };
            return newList;
        });
    };

    const addNewExperience = () => {
        setExperienceList(prev => [...prev, {...formField}]);
    };

    const removeExperience = (index) => {
        setExperienceList(prev => prev.filter((_, i) => i !== index));
    };

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await GlobalApi.UpdateResumeDetail(params?.resumeId, {
                Experience: experienceList
            });
            
            setResumeInfo(prev => ({
                ...prev,
                Experience: experienceList
            }));
            
            enabledNext(true);
            toast.success('Experience updated successfully');
        } catch (error) {
            console.error('Error updating experience:', error);
            toast.error('Failed to update experience');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-bold text-lg'>Experience</h2>
                    <span className='text-sm text-gray-500'>Add your work experience</span>
                </div>
                <Button
                    variant="outline"
                    onClick={addNewExperience}
                    type="button"
                    className="border-primary text-primary"
                >
                    <Plus className='h-4 w-4 mr-2' />
                    Add Experience
                </Button>
            </div>

            <form onSubmit={onSave}>
                {experienceList.map((item, index) => (
                    <div key={index} className='mt-5 border rounded-lg p-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm'>Job Title</label>
                                <Input
                                    name='title'
                                    value={item.title}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='Software Engineer'
                                    required
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Company Name</label>
                                <Input
                                    name='companyName'
                                    value={item.companyName}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='Company Name'
                                    required
                                />
                            </div>
                            <div>
                                <label className='text-sm'>City</label>
                                <Input
                                    name='city'
                                    value={item.city}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='City'
                                    required
                                />
                            </div>
                            <div>
                                <label className='text-sm'>State</label>
                                <Input
                                    name='state'
                                    value={item.state}
                                    onChange={(e) => handleChange(index, e)}
                                    placeholder='State'
                                    required
                                />
                            </div>
                            <div>
                                <label className='text-sm'>Start Date</label>
                                <Input
                                    type='date'
                                    name='startDate'
                                    value={item.startDate}
                                    onChange={(e) => handleChange(index, e)}
                                    required
                                />
                            </div>
                            <div>
                                <label className='text-sm'>End Date</label>
                                <Input
                                    type='date'
                                    name='endDate'
                                    value={item.endDate}
                                    onChange={(e) => handleChange(index, e)}
                                    required
                                />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <label className='text-sm'>Work Summary</label>
                            <RichTextEditor
                                value={item.workSummery}
                                onChange={(value) => handleChange(index, {target: {name: 'workSummery', value}})}
                            />
                        </div>
                        <div className='mt-4 flex justify-end'>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeExperience(index)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}

                <div className='mt-5 flex justify-end'>
                    <Button
                        type="submit"
                        disabled={loading || experienceList.length === 0}
                    >
                        {loading ? <LoaderCircle className='animate-spin mr-2' /> : 'Save & Continue'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Experience;