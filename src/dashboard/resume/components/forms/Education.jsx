import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle, Plus } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

const defaultEducation = {
  universityName: '',
  degree: '',
  major: '',
  startDate: '',
  endDate: '',
  description: ''
};

function Education({ enabledNext }) {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [educationList, setEducationList] = useState([{ ...defaultEducation }]);

  // Initialize education list from context
  useEffect(() => {
    if (resumeInfo?.education?.length > 0) {
      setEducationList(resumeInfo.education);
    } else if (resumeInfo?.education === undefined && resumeInfo) {
      // If education is undefined but resumeInfo exists, initialize it
      setResumeInfo(prev => ({
        ...prev,
        education: [{ ...defaultEducation }]
      }));
    }
  }, [resumeInfo]);

  // Update context when education list changes
  useEffect(() => {
    if (resumeInfo && educationList) {
      setResumeInfo(prev => ({
        ...prev,
        education: educationList
      }));
    }
  }, [educationList]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setEducationList(prevList => {
      const newList = [...prevList];
      newList[index] = {
        ...newList[index],
        [name]: value
      };
      return newList;
    });
  };

  const addNewEducation = () => {
    setEducationList(prev => [...prev, { ...defaultEducation }]);
  };

  const removeEducation = (index) => {
    setEducationList(prev => prev.filter((_, i) => i !== index));
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!educationList?.length) return;

    setLoading(true);
    try {
      await GlobalApi.UpdateResumeDetail(params.resumeId, {
        education: educationList
      });
      
      enabledNext?.(true);
      toast.success('Education details updated successfully');
    } catch (error) {
      console.error('Error updating education:', error);
      toast.error('Failed to update education details');
    } finally {
      setLoading(false);
    }
  };

  if (!educationList) {
    return null; // or a loading state
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-lg'>Education</h2>
          <span className='text-sm text-gray-500'>Add your educational details</span>
        </div>
        <Button
          variant="outline"
          onClick={addNewEducation}
          type="button"
          className="border-primary text-primary"
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Education
        </Button>
      </div>

      <form onSubmit={onSave}>
        {Array.isArray(educationList) && educationList.map((item, index) => (
          <div key={index} className='grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label className='text-sm'>University Name</label>
              <Input
                name="universityName"
                value={item?.universityName || ''}
                onChange={(e) => handleChange(e, index)}
                className='mt-1'
                required
              />
            </div>
            <div>
              <label className='text-sm'>Degree</label>
              <Input
                name="degree"
                value={item?.degree || ''}
                onChange={(e) => handleChange(e, index)}
                className='mt-1'
                required
              />
            </div>
            <div>
              <label className='text-sm'>Major</label>
              <Input
                name="major"
                value={item?.major || ''}
                onChange={(e) => handleChange(e, index)}
                className='mt-1'
                required
              />
            </div>
            <div>
              <label className='text-sm'>Start Date</label>
              <Input
                type='date'
                name="startDate"
                value={item?.startDate || ''}
                onChange={(e) => handleChange(e, index)}
                className='mt-1'
                required
              />
            </div>
            <div>
              <label className='text-sm'>End Date</label>
              <Input
                type='date'
                name="endDate"
                value={item?.endDate || ''}
                onChange={(e) => handleChange(e, index)}
                className='mt-1'
              />
            </div>
            <div className='col-span-2'>
              <label className='text-sm'>Description</label>
              <Textarea
                name="description"
                value={item?.description || ''}
                onChange={(e) => handleChange(e, index)}
                className='mt-1'
                rows={3}
              />
            </div>
            {educationList.length > 1 && (
              <div className='col-span-2 flex justify-end'>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeEducation(index)}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className='mt-5 flex justify-end gap-4'>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <LoaderCircle className='h-4 w-4 mr-2 animate-spin' />
                Saving...
              </>
            ) : (
              'Save & Continue'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Education;