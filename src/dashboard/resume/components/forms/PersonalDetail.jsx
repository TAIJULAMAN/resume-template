import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';

function PersonalDetail({enabledNext}) {
    const params = useParams();
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resumeInfo?.personalDetails) {
            setFormData(resumeInfo.personalDetails);
        }
    }, [resumeInfo]);

    const handleInputChange = (e) => {
        enabledNext(false);
        const {name, value} = e.target;

        const updatedFormData = {
            ...formData,
            [name]: value
        };
        setFormData(updatedFormData);

        setResumeInfo(prev => ({
            ...prev,
            personalDetails: updatedFormData
        }));
    }

    const onSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const data = {
                personalDetails: formData
            };
            
            await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
            enabledNext(true);
            toast.success("Details updated successfully");
        } catch (error) {
            console.error('Error updating details:', error);
            toast.error("Failed to update details");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Personal Detail</h2>
            <p>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-3'>
                    <div>
                        <label className='text-sm'>First Name</label>
                        <Input 
                            name='firstName'
                            value={formData?.firstName || ''}
                            onChange={handleInputChange}
                            placeholder='First Name'
                            required
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Last Name</label>
                        <Input 
                            name='lastName'
                            value={formData?.lastName || ''}
                            onChange={handleInputChange}
                            placeholder='Last Name'
                            required
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Job Title</label>
                        <Input 
                            name='jobTitle'
                            value={formData?.jobTitle || ''}
                            onChange={handleInputChange}
                            placeholder='Job Title'
                            required
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className='text-sm'>Address</label>
                        <Input 
                            name='address'
                            value={formData?.address || ''}
                            onChange={handleInputChange}
                            placeholder='Address'
                            required
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Phone</label>
                        <Input 
                            name='phone'
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            placeholder='Phone Number'
                            required
                        />
                    </div>
                    <div>
                        <label className='text-sm'>Email</label>
                        <Input 
                            name='email'
                            value={formData?.email || ''}
                            onChange={handleInputChange}
                            placeholder='Email'
                            type='email'
                            required
                        />
                    </div>
                </div>
                <div className='mt-3 flex justify-end'>
                    <Button 
                        className='mt-5' 
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PersonalDetail