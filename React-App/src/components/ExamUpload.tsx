import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Modal } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import useModal from '../hooks/useModal';
import examService from "../services/ExamService";


const ExamUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [examDetails, setExamDetails] = useState({ name: '', description: '' });
    const { isOpen, openModal, closeModal } = useModal();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            console.log('Selected file:', selectedFile.name);
            openModal({
                title: 'Enter Exam Details',
                onConfirm: handleUpload,
                confirmText: 'Upload',
                children: (
                    <>
                        <TextField
                            label="Exam Name"
                            value={examDetails.name}
                            onChange={(e) => setExamDetails({ ...examDetails, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Exam Description"
                            value={examDetails.description}
                            onChange={(e) => setExamDetails({ ...examDetails, description: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </>
                ),
            });
        }
    };

    const handleUpload = async () => {
        if (file) {
            try {
                const result = await examService.uploadExamFile(file, examDetails);
                onUploadSuccess(`File uploaded successfully: ${result.message}`);
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

            <Modal open={isOpen} onClose={closeModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Enter Exam Details
                    </Typography>
                    <Box sx={{ borderBottom: '1px solid lightgray', mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Exam Name"
                            value={examDetails.name}
                            onChange={(e) => setExamDetails({ ...examDetails, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Exam Description"
                            value={examDetails.description}
                            onChange={(e) => setExamDetails({ ...examDetails, description: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: "30px" }}>
                        <Button
                            variant="outlined"
                            onClick={closeModal}
                            sx={{
                                bgcolor: 'white',
                                border: '1px solid lightgray',
                                borderRadius: '5px',
                                '&:hover': {
                                    bgcolor: 'lightgray',
                                    color: 'white',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleUpload}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            Upload
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ExamUpload;
