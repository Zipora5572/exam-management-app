import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { deleteExamFile, getAllExams, renameExamFile } from '../store/examSlice';
import ExamService from '../services/ExamService';

interface FileMenuProps {
    anchorEl: null | HTMLElement;
    selectedRow: number | null;
    handleMenuClose: () => void;
    id: number;
    uniqueFileName: string;
    examName: string;
    openModal: (data: { title: string; initialName?: string; setNewName?: (name: string) => void; confirmText?: string; onConfirm?: (name: string) => void; children?: React.ReactNode; }) => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ anchorEl, selectedRow, handleMenuClose, uniqueFileName, examName,id, openModal }) => {
    const [newName, setNewName] = useState<string>(examName);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        setNewName(examName);
    }, [examName]);

    const handleDownload = async () => {
        try {
            await ExamService.download(uniqueFileName); 
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        handleMenuClose();
    };
    // const handleDownload = () => {
    //     const fileId = "1yqsVCieVhfw9ibYc-U9orUIMaVhiK2YN";
    //     const fileUrl = `https://storage.googleapis.com/exams-bucket/fa9563ef-5a60-4cb1-b725-21c378afb60b.png`;
    
    //     const link = document.createElement('a');
    //     link.href = fileUrl;
    //     link.download = 'filename.png'; // הוסף שם לקובץ שיתקבל
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    
    //     console.log(`Downloading ${fileId}`);
    //     handleMenuClose();
    // };
    
    const handleDelete = () => {
        openModal({
            title: 'Delete',
            children: (
                <div>
                    You and the people you shared this file with won't be able to access it once it has been deleted. The file will be permanently deleted, and this action can't be undone.
                </div>
            ),
            confirmText: 'Delete',
            onConfirm: () => {
             dispatch(deleteExamFile(examName));
             dispatch(getAllExams())
             handleMenuClose();
            },
        });
    };

    const handleRename = () => {
        openModal({
            title: 'Rename',
            initialName: examName,
            setNewName: (name: string) => {
                setNewName(name);
            },
            confirmText: 'Rename',
            onConfirm: (updatedName: string) => {
                dispatch(renameExamFile({id:id, newName:updatedName}));
                dispatch(getAllExams())
                handleMenuClose();
            },
        });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow !== null}
            onClose={handleMenuClose}
            sx={{boxShadow: 0}}
        >
            <MenuItem onClick={handleDelete}>Delete Item</MenuItem>
            <MenuItem onClick={handleDownload}>Download</MenuItem>
            <MenuItem onClick={handleRename}>Rename</MenuItem>
        </Menu>
    );
};

export default FileMenu;