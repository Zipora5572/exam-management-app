import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress, 
} from '@mui/material';
import ExamDetailsRow from './ExamDetailsRow';
import ModalWrapper from '../ModalWrapper';
import useModal from '../../hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { ExamFileType, ExamFolderType } from '../../models/Exam';
import NoDocuments from '../NoDocuments';

interface ExamTableProps {
    exams: ExamFileType[];
    folders: ExamFolderType[];
    loading: boolean;
    currentFolderId: number | null; 
    setCurrentFolderId: React.Dispatch<React.SetStateAction<number | null>>; 
    currentFolderName: string | null; 
    setCurrentFolderName: React.Dispatch<React.SetStateAction<string | null>>; 
    folderPath: { id: number | null; name: string }[];  // הוספה
    setFolderPath: React.Dispatch<React.SetStateAction<{ id: number | null; name: string }[]>>; // הוספה
}

const ExamTable: React.FC<ExamTableProps> = ({
    exams,
    folders,
    loading,
    currentFolderId,
    setCurrentFolderId,
    currentFolderName,
    setCurrentFolderName,
    folderPath,
    setFolderPath,

}) => {
    const [selectedFile, setSelectedFile] = useState<{ name: string; url: string } | null>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const [viewMode, setViewMode] = useState<'all'  | 'folder'>('all');
    const [filteredExams, setFilteredExams] = useState<(ExamFileType )[]>(exams);
    const [filteredFolders, setFilteredFolders] = useState<(ExamFolderType )[]>(folders);
    
    useEffect(() => {
      if (viewMode === 'folder' && currentFolderId !== null) {
    
            setFilteredExams(exams.filter((exam) => exam.folderId === currentFolderId ));
            setFilteredFolders(folders.filter((folder) => folder.parentFolderId === currentFolderId  ));
        } else {
            setFilteredExams(exams.filter((exam) => exam.folderId === null)); 
            setFilteredFolders(folders.filter((folder) => folder.parentFolderId === null));
        }
    }, [viewMode, currentFolderId, exams]);
    
   
    const openFolder = (folderId: number, folderName: string) => {
        setFolderPath(prevPath => [...prevPath, { id: folderId, name: folderName }]); 
        setCurrentFolderId(folderId);
        setCurrentFolderName(folderName)
        setViewMode('folder');
    };
    
    const navigate=useNavigate()
    const handleRowClick = (fileName: string, fileUrl: string) => {
        console.log('handleRowClick', fileName, fileUrl);
        
        setSelectedFile({ name: fileName, url: fileUrl });
    };
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };
    if(selectedFile) {
        navigate('/viewExam')
    }

    return (
        <>
                    {!loading&&filteredFolders.length==0&&filteredExams.length==0?
                          <NoDocuments folderId={currentFolderId} />
                        :
            <TableContainer component={Paper} style={{ boxShadow: 'none', position: 'relative' }}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Sharing</TableCell>
                            <TableCell>Modified</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                        
                    <TableBody style={{ border: '1px solid #e0e0e0' }}>
                     
                    {filteredFolders.map((row, index) => (
                            <ExamDetailsRow
                                key={index}
                                row={row}
                                isFolder={true}
                                index={index}
                                handleMenuClick={handleMenuClick}
                                anchorEl={anchorEl}
                                selectedRow={selectedRow}
                                handleMenuClose={handleMenuClose}
                                openFolder={openFolder}
                                openModal={openModal}
                                handleRowClick={handleRowClick}
                            />
                        ))}
                        {filteredExams.map((row, index) => (
                            <ExamDetailsRow
                                key={index}
                                row={row}
                                isFolder={false}
                                index={index}
                                handleMenuClick={handleMenuClick}
                                anchorEl={anchorEl}
                                selectedRow={selectedRow}
                                handleMenuClose={handleMenuClose}
                                openFolder={openFolder}
                                openModal={openModal}
                                handleRowClick={handleRowClick}
                            />
                        ))}

                    </TableBody>
                    
                </Table>
               
            </TableContainer>}

            {loading && (
                            <div style={{ position: 'absolute', bottom: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <CircularProgress />
                            </div>
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

export default ExamTable;
