import React, { useState } from 'react';
import {  IconButton, TextField } from '@mui/material';
import ExamUpload from './ExamUpload';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import { createFolder } from '../store/examSlice';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import Tooltip from '@mui/material/Tooltip';

interface ActionButtonsProps {
    folderId: number | null;
    folderName: string
    openModal: (data: { title: string; initialName?: string; setNewName?: (name: string) => void; confirmText?: string; onConfirm?: (name: string) => void; children?: React.ReactNode; }) => void;

    modalData: { setNewName?: (name: string) => void };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ folderId, folderName, openModal, modalData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: StoreType) => state.auth.user);
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
                dispatch(createFolder({ userId: user?.id, parentFolderId: folderId, folderName: folderName }));
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
        
            <Tooltip title="Create Folder" arrow>
            <CreateNewFolderIcon 
    onClick={handleCreateFolder} 
    sx={{
        margin:'5px',
        cursor: 'pointer',
        fontSize: '24px', 
    }} 
/>

            </Tooltip>

            {/* כפתור העלאת קובץ */}
            <ExamUpload folderId={folderId} />
        </div>
    );
};


export default ActionButtons;