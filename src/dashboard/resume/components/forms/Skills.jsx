import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle, Plus } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const defaultSkill = {
  name: '',
  rating: 0
};

function Skills({ enabledNext }) {
  const [skillsList, setSkillsList] = useState([{ ...defaultSkill }]);
  const { resumeId } = useParams();
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  // Initialize skills list from context
  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      setSkillsList(resumeInfo.skills);
    } else if (resumeInfo?.skills === undefined && resumeInfo) {
      // If skills is undefined but resumeInfo exists, initialize it
      setResumeInfo(prev => ({
        ...prev,
        skills: [{ ...defaultSkill }]
      }));
    }
  }, [resumeInfo]);

  // Update context when skills list changes
  useEffect(() => {
    if (resumeInfo && skillsList) {
      setResumeInfo(prev => ({
        ...prev,
        skills: skillsList
      }));
    }
  }, [skillsList]);

  const handleChange = (index, name, value) => {
    setSkillsList(prevList => {
      const newList = [...prevList];
      newList[index] = {
        ...newList[index],
        [name]: value
      };
      return newList;
    });
  };

  const addNewSkill = () => {
    setSkillsList(prev => [...prev, { ...defaultSkill }]);
  };

  const removeSkill = (index) => {
    setSkillsList(prev => prev.filter((_, i) => i !== index));
  };

  const onSave = async (e) => {
    e?.preventDefault();
    if (!skillsList?.length) return;

    setLoading(true);
    try {
      await GlobalApi.UpdateResumeDetail(resumeId, {
        skills: skillsList
      });
      
      enabledNext?.(true);
      toast.success('Skills updated successfully');
    } catch (error) {
      console.error('Error updating skills:', error);
      toast.error('Failed to update skills');
    } finally {
      setLoading(false);
    }
  };

  if (!skillsList) {
    return null; // or a loading state
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='font-bold text-lg'>Skills</h2>
          <span className='text-sm text-gray-500'>Add your top professional key skills</span>
        </div>
        <Button
          variant="outline"
          onClick={addNewSkill}
          type="button"
          className="border-primary text-primary"
        >
          <Plus className='h-4 w-4 mr-2' />
          Add Skill
        </Button>
      </div>

      <form onSubmit={onSave} className="mt-4">
        {Array.isArray(skillsList) && skillsList.map((item, index) => (
          <div key={`skill-${index}`} className='grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 my-3 rounded-lg'>
            <div>
              <label className='text-sm'>Skill Name</label>
              <Input
                value={item?.name || ''}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className='mt-1'
                required
              />
            </div>
            <div className='flex items-end'>
              <div className='w-full'>
                <label className='text-sm'>Proficiency</label>
                <Rating
                  style={{ maxWidth: 120 }}
                  value={item?.rating || 0}
                  onChange={(v) => handleChange(index, 'rating', v)}
                />
              </div>
              {skillsList.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSkill(index)}
                  className="ml-2 mb-1"
                >
                  Remove
                </Button>
              )}
            </div>
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

export default Skills;