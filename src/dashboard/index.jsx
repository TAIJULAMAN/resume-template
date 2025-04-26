import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import GlobalApi from './../../service/GlobalApi'
import ResumeCardItem from './components/ResumeCardItem'

function Dashboard() {
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResumesList();
  }, []);

  const getResumesList = () => {
    try {
      const resumes = GlobalApi.GetUserResumes();
      setResumeList(resumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start Creating AI resume to your next Job role</p>
      <div className='grid grid-cols-2 
      md:grid-cols-3 lg:grid-cols-4 gap-5
      mt-10'>
        <AddResume />
        {loading ? (
          // Loading skeleton
          [1, 2, 3].map((item, index) => (
            <div key={index} className='h-[200px] rounded-lg bg-slate-200 animate-pulse'>
            </div>
          ))
        ) : resumeList.length > 0 ? (
          // Resume list
          resumeList.map((resume, index) => (
            <ResumeCardItem 
              resume={resume} 
              key={resume.id} 
              refreshData={getResumesList} 
            />
          ))
        ) : (
          // Empty state
          <div className='col-span-3 text-center text-gray-500 mt-10'>
            No resumes yet. Click the + button to create your first resume!
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard