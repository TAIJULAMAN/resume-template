import { Loader2Icon, MoreVertical, Notebook } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'

function ResumeCardItem({ resume, refreshData }) {
  const navigation = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = () => {
    setLoading(true);
    try {
      localStorage.removeItem(`resume-${resume.id}`);
      toast('Resume Deleted!');
      refreshData();
      setLoading(false);
      setOpenAlert(false);
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return (
    <div className=''>
      <Link to={'/dashboard/resume/' + resume.id + "/edit"}>
        <div className='p-4 hover:bg-secondary rounded-lg transition-all cursor-pointer'>
          <div className='flex gap-3 items-center'>
            <Notebook className='h-8 w-8 text-primary' />
            <div>
              <h2 className='font-bold'>{resume.title}</h2>
              <h2 className='text-gray-400 text-sm'>Last updated: {formatDate(resume.updatedAt)}</h2>
            </div>
          </div>
        </div>
      </Link>

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              resume and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>
              {loading ? <Loader2Icon className='animate-spin' /> : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className='absolute right-5 top-5'>
        <DropdownMenu>
          <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={'/my-resume/' + resume.id + '/view'}>
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setOpenAlert(true)}
              className='text-red-600'>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default ResumeCardItem