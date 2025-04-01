import React, {  useState } from 'react';
import { Button, TextField } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import useModal from '../hooks/useModal';
import { ExamFileType } from "../models/Exam";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import ModalWrapper from './ModalWrapper';
import { uploadExamFile } from '../store/examSlice';
const ExamUpload = ({ folderId }: { folderId: number | undefined }) => {
    const user = useSelector((state: StoreType) => state.auth.user);
    const [file, setFile] = useState<File | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const [examDetails, setExamDetails] = useState<Partial<ExamFileType>>({
        userId: 1,
        examName: ' ',
        folderId: folderId,
        topic: { name: 'name', description: 'desc' },
    });

    const { isOpen, openModal, closeModal, modalData } = useModal();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            
            let localTopic = { 
                name: examDetails.topic?.name || '', 
                description: examDetails.topic?.description || '' 
            };
    
            openModal({
                title: 'Enter Exam Details',
                confirmText: 'Upload',
                onConfirm: () => {
                    setExamDetails(prevDetails => ({
                        ...prevDetails,
                        topic: { name: localTopic.name, description: localTopic.description }
                    }));
                    handleUpload(selectedFile);
                               },
                children: (
                    <>
                        <TextField
                            label="Name"
                            defaultValue={examDetails.topic?.name}
                            onChange={(e) => { localTopic.name = e.target.value; }}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            defaultValue={examDetails.topic?.description}
                            onChange={(e) => { localTopic.description = e.target.value; }}
                            fullWidth
                            margin="normal"
                        />
                    </>
                ),
            });
        }
    };
  
    const handleUpload = async (selectedFile: File) => {
        if (selectedFile) {
            try {
              
                
                examDetails.folderId = folderId;
                dispatch(uploadExamFile({file:selectedFile,examDetails:examDetails}))
               
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                closeModal();
            }
        }
    };

    return (
        <div>
            <input
                accept="*"
                style={{ display: 'none' }}
                id="upload-file-input"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="upload-file-input">
                <Button
                    variant="contained"
                    component="span"
                    style={{
                        height: '30px',
                        marginLeft: 'auto',
                        borderRadius: '20px',
                        border: '2px solid black',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        color: 'black',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    }}
                    startIcon={<UploadIcon />}
                >
                    Upload Exam
                </Button>
            </label>

            <ModalWrapper
                open={isOpen}
                handleClose={closeModal}
                title={modalData?.title || ''}
                onConfirm={modalData?.onConfirm}
                confirmText={modalData?.confirmText}
            >
                {modalData?.children}
            </ModalWrapper>
        </div>
    );
};
export default ExamUpload