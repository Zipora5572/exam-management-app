import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FolderIcon from '@mui/icons-material/Folder';

interface ActionButtonsProps {
    data: any[];
    setData: React.Dispatch<React.SetStateAction<any[]>>;
    openModal: (data: { title: string; confirmText: string; onConfirm: (name: string) => void; children: React.ReactNode }) => void;
    modalData: { setNewName?: (name: string) => void };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ data, setData, openModal, modalData }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            console.log('Selected file:', event.target.files[0].name);
        }
    };

    const handleUpload = () => {
        if (file) {
            console.log('Uploading file:', file.name);
            // כאן תוכל להוסיף את הלוגיקה להעלאת הקובץ
        }
    };

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

    return (
        <div>
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
                    onClick={handleUpload}
                >
                    Upload File
                </Button>
            </label>
        </div>
    );
};

export default ActionButtons;