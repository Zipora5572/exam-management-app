import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import useModal from '../hooks/useModal';
import { ExamFileType } from "../models/Exam";
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import ModalWrapper from './ModalWrapper';
import ExamService from '../services/ExamService';
const ExamUpload = ({ folderId }: { folderId: number | undefined }) => {
  

    const user = useSelector((state: StoreType) => state.auth.user);
    const [file, setFile] = useState<File | null>(null);

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
            console.log('Selected file:', selectedFile.name);
          
            openModal({
                title: 'Enter Exam Details',
                onConfirm: () => handleUpload(selectedFile),
                confirmText: 'Upload',
                children: (
                    <>
                        <TextField
                            label="Topic Name"
                            value={examDetails.topic?.name }
                            onChange={(e) => setExamDetails(prevDetails => ({
                                ...prevDetails,              
                                topic: {
                                    name: e.target.value,
                                    description: prevDetails.topic?.description
                                }
                            }))}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Topic Description"
                            value={examDetails.topic?.description }
                            onChange={(e) => setExamDetails(prevDetails => ({
                                ...prevDetails,                    
                                topic: {
                                    name: prevDetails.topic?.name,
                                    description: e.target.value
                                }
                            }))}
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
                 const result = await ExamService.uploadExamFile(selectedFile, examDetails);
                console.log(`File uploaded successfully: ${result.message}`);
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
                        marginLeft: 'auto',
                        borderRadius: '20px',
                        border: '2px solid black',
                        fontWeight: 'bold',
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

export default ExamUpload;