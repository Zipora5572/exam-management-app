import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress, // הוסף ייבוא זה
} from '@mui/material';
import ExamDetailsRow from './ExamDetailsRow';
import ModalWrapper from '../ModalWrapper';
import useModal from '../../hooks/useModal';

interface Exam {
    id: number;
    examName: string;
    sharing: string;
    modified: string;
    type: string;
    uniqueFileName: string;
}

interface ExamTableProps {
    exams: Exam[];
    loading: boolean; // הוסף את פרופס ה-loading
    handleMenuClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
    anchorEl: null | HTMLElement;
    selectedRow: number | null;
    handleMenuClose: () => void;
    openFolder: (folderId: number) => void;
}
const ExamTable: React.FC<ExamTableProps> = ({
    exams,
    loading,
    openFolder,

}) => {
    const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    return (
        <>

            <TableContainer component={Paper} style={{ boxShadow: 'none', position: 'relative' }}>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Modified</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ border: '1px solid #e0e0e0' }}>
                      
                        {exams.map((row, index) => (
                            <ExamDetailsRow
                                key={index}
                                row={row}
                                index={index}
                                handleMenuClick={handleMenuClick}
                                anchorEl={anchorEl}
                                selectedRow={selectedRow}
                                handleMenuClose={handleMenuClose}
                                openFolder={openFolder}
                                openModal={openModal}
                            />
                        ))}
                    </TableBody>
                    
                </Table>
               
            </TableContainer>
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
                setNewName={modalData?.setNewName || (() => { })}
            >
                {modalData?.children}
            </ModalWrapper>
        </>
    );
};

export default ExamTable;
