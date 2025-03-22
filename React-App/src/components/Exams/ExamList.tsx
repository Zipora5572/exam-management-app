import React, { useEffect, useState } from 'react';
import {
    Typography,
} from '@mui/material';
import { ExamFileType, ExamFolderType } from '../../models/Exam';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import useModal from '../../hooks/useModal';
import ModalWrapper from '../ModalWrapper';
import ActionButtons from '../ActionButtons';
import { getAllExams, getAllFolders } from '../../store/examSlice';
import ExamsTable from './ExamsTable';

const ExamList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const exams = useSelector((state: StoreType) => state.exams.exams);
    const folders = useSelector((state: StoreType) => state.exams.folders);
    const loading = useSelector((state: StoreType) => state.exams.loading);
    const error = useSelector((state: StoreType) => state.exams.error);
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);

    useEffect(() => {
        dispatch(getAllFolders());
        dispatch(getAllExams());
    }, [dispatch]);
  

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>
                Your Exams {currentFolderName ? ` > ${currentFolderName}` : ''}
                </Typography>
             
                <ActionButtons folderId={currentFolderId} folderName={"a"}  openModal={openModal} modalData={modalData} />
            </div>
            {error ? (
                <Typography color="error">{error}</Typography> 
            ) : (
                <ExamsTable
                    exams={exams}
                    folders={folders}
                    loading={loading} 
                    currentFolderId={currentFolderId} 
                    setCurrentFolderId={setCurrentFolderId} 
                    currentFolderName={currentFolderName}
                    setCurrentFolderName={setCurrentFolderName}

                />
            )}
            <ModalWrapper
                open={isOpen}
                handleClose={closeModal}
                title={modalData?.title || ''}
                onConfirm={modalData?.onConfirm}
                confirmText={modalData?.confirmText}
                initialName={modalData?.initialName}
                setNewName={modalData?.setNewName || (() => {})}
            >
                {modalData?.children}
            </ModalWrapper>
        </>
    );
};

export default ExamList;
