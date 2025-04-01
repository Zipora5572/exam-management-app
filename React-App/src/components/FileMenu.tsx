import React, { useState, useEffect, useRef } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { deleteExamFile, getAllExams, renameExamFile } from '../store/examSlice';
import StudentExamService from '../services/StudentExamService';
import ExamService from '../services/ExamService';
import { ExamFileType, ExamFolderType } from '../models/Exam';
import { deleteFolder, renameFolder } from '../store/folderSlice';


interface FileMenuProps {
    anchorEl: null | HTMLElement;
    selectedRow: number | null;
    handleMenuClose: () => void;
    id: number;
    row: ExamFileType | ExamFolderType;
   
    openModal: (data: { title: string; initialName?: string; setNewName?: (name: string) => void; confirmText?: string; onConfirm?: () => void; children?: React.ReactNode; }) => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ anchorEl, selectedRow, handleMenuClose, id, openModal, row }) => {
    const [newName, setNewName] = useState<string>(row.examName);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const selectedFilesRef = useRef<FileList | null>(null);

    useEffect(() => {
        setNewName(row.examName);
    }, [row.examName]);

    useEffect(() => {
        if (selectedFiles && selectedFiles.length > 0) {
            console.log('Updated selected files:', selectedFiles);
            selectedFilesRef.current = selectedFiles;
        }
    }, [selectedFiles]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFiles(event.target.files);
            console.log('Files selected:', event.target.files);
        }
    };


    const handleUploadStudentExams = () => {
        openModal({
            title: 'Upload Student Exams',
            children: (
                <div>
                    <p>Choose to upload a full folder of student exams or a single file.</p>
                    <input
                        accept="*"
                        style={{ display: 'none' }}
                        id="upload-folder-input"
                        type="file"
                        multiple
                        {...({ webkitdirectory: "true" } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
                        onChange={handleFileChange}
                    />
                    <input
                        accept="*"
                        style={{ display: 'none' }}
                        id="upload-folder-input"
                        type="file"
                        multiple
                        {...({ webkitdirectory: "true" } as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-folder-input">
                        <Button
                            variant="text"
                            component="span"
                            sx={{ color: 'black', fontWeight: "bold", transition: 'none' }}
                        >
                            Folder
                        </Button>
                    </label>
                    <br />
                    <input
                        accept="*"
                        style={{ display: 'none' }}
                        id="upload-student-file-input"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-student-file-input">
                        <Button variant="text" sx={{ color: 'black', fontWeight: "bold", transition: 'none' }} component="span">
                            Upload File
                        </Button>
                    </label>

                </div>
            ),
            confirmText: 'Upload',
            onConfirm: () => {
                const filesToUpload = selectedFilesRef.current;


                handleFilesUpload(filesToUpload);

            },
        });
    };

    const handleFilesUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        try {
            await StudentExamService.uploadStudentExams({ examId: id }, files);
            dispatch(getAllExams());
        } catch (error) {
            console.error("Error uploading student exams:", error);
        }
        handleMenuClose();
    };


    const handleDownload = async () => {
        try {
            await ExamService.download(row.examNamePrefix);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        handleMenuClose();
    };


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
                if (row.type == "FILE")
                dispatch(deleteExamFile(id.toString()));
            else
                dispatch(deleteFolder(id.toString()));

               
                handleMenuClose();
            },
        });
    };
    
    
    const handleRename = () => {
        openModal({
            title: 'Rename',
            initialName: row.type == "FILE" ? row.examName : row.folderName,
            setNewName: (name: string) => {
                setNewName(name);
            },
            confirmText: 'Rename',
            onConfirm: (updatedName: string) => {
                if (row.type == "FILE")
                    dispatch(renameExamFile({ id: id, newName: updatedName }));
                else
                     dispatch(renameFolder({ id: id, newName: updatedName }));
                // dispatch(getAllExams());
                handleMenuClose();
                
            },
        });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow == row.id}
            onClose={handleMenuClose}
            sx={{ boxShadow: 'none' }}
        >
            <MenuItem onClick={handleUploadStudentExams}>Upload Student Exams</MenuItem>
            <MenuItem onClick={handleDelete}>Delete Item</MenuItem>
            <MenuItem onClick={handleDownload}>Download</MenuItem>
            <MenuItem onClick={handleRename}>Rename</MenuItem>
        </Menu>
    );
};

export default FileMenu;
