import React from 'react';
import { Button, TextField } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ExamUpload from './ExamUpload';

interface ActionButtonsProps {
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    openModal: (data: { title: string; confirmText: string; onConfirm: (name: string) => void; children: React.ReactNode }) => void;
    modalData: { setNewName?: (name: string) => void };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ data, setData, openModal, modalData }) => {

    const handleCreateFolder = () => {
        openModal({
            title: 'Create New Folder',
            confirmText: 'Create',
            onConfirm: (name: string) => {
                const newFolder = {
                    id: data.length + 1, // או לוגיקה אחרת ל-ID
                    folderName: name,
                    type: 'folder',
                    children: [],
                };
                setData([...data, newFolder]); // הוספת התיקיה החדשה למצב
                console.log('New folder created:', name);
            },
            children: (
                <TextField
                    label="Folder Name"
                    fullWidth
                    onChange={(e) => {
                        const newName = e.target.value;
                        modalData.setNewName && modalData.setNewName(newName);
                    }}
                />
            ),
        });
    };

    // const handleUploadSuccess = (message: string) => {
    //     alert(message);
    // };

    return (
        <div style={{display:"flex"}}>
            <Button
                variant="contained"
                style={{
                    marginLeft: 'auto',
                    borderRadius: '20px',
                    border: '2px solid black',
                    fontWeight: 'bold',
                    color: 'black',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    marginRight: '8px',
                }}
                startIcon={<FolderIcon />}
                onClick={handleCreateFolder}
            >
                Create Folder
            </Button>
            <ExamUpload  />
        </div>
    );
};

export default ActionButtons;