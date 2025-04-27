import React from 'react'

function SkillsPreview({resumeInfo}) {
  if (!resumeInfo?.content?.skills?.length) return null;

  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2'
        style={{
          color: resumeInfo?.themeColor
        }}
      >
        Skills
      </h2>
      <hr style={{
        borderColor: resumeInfo?.themeColor
      }} />

      <div className='grid grid-cols-2 gap-3 my-4'>
        {resumeInfo.content.skills.map((skill, index) => (
          <div key={`skill-${index}`} className='flex items-center justify-between gap-4'>
            <h2 className='text-xs font-medium'>{skill.name}</h2>
            <div className='h-2 bg-gray-200 rounded-full w-[120px]'>
              <div 
                className='h-2 rounded-full transition-all duration-300'
                style={{
                  backgroundColor: resumeInfo?.themeColor,
                  width: `${skill?.rating * 20}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsPreview