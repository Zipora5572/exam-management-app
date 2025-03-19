import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
} from '@mui/material';
import { ExamFileType, ExamFolderType } from '../../models/Exam';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import useModal from '../../hooks/useModal';
import ModalWrapper from '../ModalWrapper';
import ActionButtons from '../ActionButtons';
import { getAllExams } from '../../store/examSlice';
import ExamsTable from './ExamsTable';

const ExamList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const exams = useSelector((state: StoreType) => state.exams.exams);
    const loading = useSelector((state: StoreType) => state.exams.loading);
    const error = useSelector((state: StoreType) => state.exams.error);
    const [data, setData] = useState<(ExamFileType | ExamFolderType)[]>([]); 
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    useEffect(() => {
        dispatch(getAllExams());
    }, [dispatch]);
  

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>
                    Your Exams
                </Typography>
                <ActionButtons data={data} setData={setData} openModal={openModal} modalData={modalData} />
            </div>
            {error ? (
                <Typography color="error">{error}</Typography> 
            ) : (
                <ExamsTable
                    exams={exams}
                    loading={loading} // העבר את מצב ה-loading
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
