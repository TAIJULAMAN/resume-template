import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'
import { cn } from '@/lib/utils'

function ResumePreview({ className }) {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No resume data available</p>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'bg-white shadow-lg min-h-[297mm] w-[210mm] mx-auto p-14 border-t-[20px]',
        'print:shadow-none print:border print:p-12',
        className
      )}
      style={{
        borderColor: resumeInfo?.themeColor || '#2563eb'
      }}
    >
      <div className="space-y-6">
        {/* Personal Details */}
        <PersonalDetailPreview resumeInfo={resumeInfo} />

        {/* Summary */}
        {resumeInfo?.content?.summary && (
          <SummeryPreview resumeInfo={resumeInfo} />
        )}

        {/* Professional Experience */}
        {resumeInfo?.content?.experience?.length > 0 && (
          <ExperiencePreview resumeInfo={resumeInfo} />
        )}

        {/* Education */}
        {resumeInfo?.content?.education?.length > 0 && (
          <EducationalPreview resumeInfo={resumeInfo} />
        )}

        {/* Skills */}
        {resumeInfo?.content?.skills?.length > 0 && (
          <SkillsPreview resumeInfo={resumeInfo} />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-center text-gray-400 print:hidden">
        Created with AI Resume Builder
      </div>
    </div>
  )
}

export default ResumePreview