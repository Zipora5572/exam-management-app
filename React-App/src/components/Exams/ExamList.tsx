import { useEffect, useState } from 'react';
import {
    Breadcrumbs,
    Link,
    Typography,
    IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import useModal from '../../hooks/useModal';
import ModalWrapper from '../ModalWrapper';
import ActionButtons from '../ActionButtons';
import { getAllExams } from '../../store/examSlice';
import ExamsTable from './ExamsTable';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { getAllFolders } from '../../store/folderSlice';
import { useLocation } from 'react-router-dom';

const ExamList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const exams = useSelector((state: StoreType) => state.exams.exams);
    const folders = useSelector((state: StoreType) => state.folders.folders);
    const loading = useSelector((state: StoreType) => state.exams.loading);
    const error = useSelector((state: StoreType) => state.exams.error);
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [currentFolderName, setCurrentFolderName] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<{ id: number | null; name: string }[]>([]);
    const location = useLocation();
    const filter = new URLSearchParams(location.search).get('filter') || 'all';
    const filteredExams = exams.filter(exam => {
        if (filter === 'shared') return exam.isShared;
        if (filter === 'starred') return exam.isStarred;
        return true; // all exams
      });
      const filteredFolders = folders.filter(folder => {
        if (filter === 'shared') return folder.isShared;
        if (filter === 'starred') return folder.isStarred;
        return true; // all exams
      });
      
    useEffect(() => {
        dispatch(getAllFolders());
        dispatch(getAllExams());
    }, [ dispatch]);

    const handleGoBack = () => {
        if (folderPath.length > 0) {
            const newPath = [...folderPath];
            newPath.pop(); 
            setFolderPath(newPath);
            setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
        }
    };

    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        
           
            <Breadcrumbs 
                aria-label="breadcrumb"
                sx={{
                    '& .MuiBreadcrumbs-separator': { color: 'gray' },
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'primary.main',
                }}
            >
                <Link 
                    onClick={() => { setFolderPath([]); setCurrentFolderId(null); }} 
                    sx={{ 
                        cursor: 'pointer', 
                        textDecoration: 'none', 
                        color: 'black', 
                        '&:hover': { color: 'gray' }
                    }}
                >
                    Your Exams
                </Link>
    
                {folderPath.map((folder, index) => (
                    <Link
                        key={folder.id}
                        onClick={() => {
                            setFolderPath(folderPath.slice(0, index + 1));
                            setCurrentFolderId(folder.id);
                        }}
                        sx={{ 
                            cursor: 'pointer', 
                            textDecoration: 'none', 
                            color: 'text.secondary', 
                            '&:hover': { color: 'gray' }
                        }}
                    >
                        {folder.name}
                    </Link>
                ))}
            </Breadcrumbs>
    
           
            <ActionButtons 
                folderId={currentFolderId} 
                folderName={currentFolderName || "ראשי"} 
                openModal={openModal} 
                modalData={modalData} 
            />
    
        </div>
    
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          
            {folderPath.length > 0 && (
                <ArrowUpwardIcon 
    onClick={handleGoBack} 
    sx={{
        cursor: 'pointer',
        fontSize: '24px', 
    }} 
/>

            )}
        </div>
    
        {error ? (
            <Typography color="error">{error}</Typography>
        ) : (
            <ExamsTable
                exams={filteredExams}
                folders={filteredFolders}
                loading={loading}
                currentFolderId={currentFolderId}
                setCurrentFolderId={setCurrentFolderId}
                currentFolderName={currentFolderName}
                setCurrentFolderName={setCurrentFolderName}
                folderPath={folderPath}  
                setFolderPath={setFolderPath}  
            />
        )}
    
        <ModalWrapper
            open={isOpen}
            handleClose={closeModal}
            title={modalData?.title || ''}
            onConfirm={modalData?.onConfirm}
            confirmText={modalData?.confirmText}
            initialName={modalData?.initialName}
            setNewName={modalData?.setNewName || (() => { })}
        >
            {modalData?.children}
        </ModalWrapper>
    </>
    
    );
};

export default ExamList;
