import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import useModal from '../hooks/useModal';
import examService from "../services/ExamService";
import { ExamType } from "../models/Exam";
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import ModalWrapper from './ModalWrapper';

const ExamUpload = () => {
    const user = useSelector((state: StoreType) => state.auth.user);
    const [file, setFile] = useState<File | null>(null);
    const [examDetails, setExamDetails] = useState<Partial<ExamType>>({
        userId:1,
        examName: ' ',
        topic: { Name: 'name', Description: 'desc' },
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
                            value={examDetails.topic?.name}
                            onChange={(e) => setExamDetails({ ...examDetails, topic: { name: e.target.value, description: examDetails.topic?.description } })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Topic Description"
                            value={examDetails.topic?.description}
                            onChange={(e) => setExamDetails({ ...examDetails, topic: { name: examDetails.topic?.name, description: e.target.value } })}
                            fullWidth
                            margin="normal"
                        />
                    </>
                ),
            });
        }
    };

    const handleUpload = async (selectedFile: File) => {
        console.log('Uploading file:', selectedFile?.name);

        if (selectedFile) {
            try {
                console.log('Uploading file:', selectedFile.name);

                const result = await examService.uploadExamFile(selectedFile, examDetails);
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