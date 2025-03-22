import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ExamUpload from './ExamUpload';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import { createFolder } from '../store/examSlice';

interface ActionButtonsProps {
    folderId: number | null;
    folderName: string
    openModal: (data: { title: string; initialName?: string; setNewName?: (name: string) => void; confirmText?: string; onConfirm?: (name: string) => void; children?: React.ReactNode; }) => void;

    modalData: { setNewName?: (name: string) => void };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ folderId, folderName, openModal, modalData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: StoreType) => state.auth.user)
    const [newName, setNewName] = useState<string>("");

    const handleCreateFolder = () => {
        openModal({
            title: 'Create New Folder',
            confirmText: 'Create',
            initialName: "",
            setNewName: (name: string) => {
                setNewName(name);
            },
            onConfirm: (folderName: string) => {

                dispatch(createFolder({ userId: user?.id,parentFolderId: folderId,folderName: folderName}));
                console.log('New folder created:', folderName);
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
        <div style={{ display: "flex" }}>
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
           
            <ExamUpload folderId={folderId} />
                
            
        </div>
    );
};

export default ActionButtons;