import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GlobalApi from './../../../service/GlobalApi'
import { useNavigate } from 'react-router-dom'

function AddResume() {
    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const onCreate = async () => {
        setLoading(true)
        const data = {
            title: resumeTitle,
            content: {
                personalDetails: {},
                experience: [],
                education: [],
                skills: [],
                summary: ''
            }
        };

        try {
            const newResume = await GlobalApi.CreateNewResume(data);
            setLoading(false);
            navigation('/dashboard/resume/' + newResume.id + "/edit");
        } catch (error) {
            console.error('Error creating resume:', error);
            setLoading(false);
        }
    }

    return (
        <div >
            <div className='p-14 py-24 border 
            items-center flex 
            justify-center bg-secondary
            rounded-lg h-[280px]
            hover:scale-105 transition-all hover:shadow-md
            cursor-pointer border-dashed'
            onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your new resume</p>
                            <Input className="my-2"
                                placeholder="Ex.Full Stack resume"
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
                            <Button
                                disabled={!resumeTitle || loading}
                                onClick={() => onCreate()}
                            >
                                {loading ?
                                    <Loader2 className='animate-spin' /> : 'Create'
                                }
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default AddResume