import React, { useState } from 'react';
import { TableCell, TableRow, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import FileMenu from '../FileMenu';
import DescriptionIcon from '@mui/icons-material/Description';
import { ExamFileType, ExamFolderType, ExamType } from '../../models/Exam';
import ExamRowButtons from '../ExamRowButtons';
import useModal from '../../hooks/useModal';

interface ExamDetailsRowProps {
    row: ExamFileType | ExamFolderType;
    isFolder: boolean;
    index: number;
    handleMenuClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
    anchorEl: null | HTMLElement;
    selectedRow: number | null;
    handleMenuClose: () => void;
    openFolder: (folderId: number,folderName:string) => void;
    openModal: (data: { title: string; initialName?: string; setNewName?: (name: string) => void; confirmText?: string; onConfirm?: (name: string) => void; children?: React.ReactNode; }) => void;
    handleRowClick: (fileName: string, fileUrl: string) => void;
}

const ExamDetailsRow: React.FC<ExamDetailsRowProps> = ({
    row,
    isFolder,
    index,
    handleMenuClick,
    anchorEl,
    selectedRow,
    handleMenuClose,
    openFolder,
    openModal,
    handleRowClick
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
        const isToday = now.toDateString() === date.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

        if (diffInMinutes < 1) {
            return "Just now";
        } else if (isToday) {
            return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (isYesterday) {
            return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        }
    };



    const formattedUpdatedAt = formatDate(row.updatedAt);

    return (
        <TableRow
            key={index}
            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>
                {isFolder ? (
                    <FolderIcon
                        style={{ color: 'rgb(144, 144, 144)', fontSize: '24px', cursor: 'pointer' }}
                        onClick={() => openFolder(row.id,row.folderName)}
                    />
                ) : (
                    <DescriptionIcon
                        style={{ color: 'rgb(144, 144, 144)', fontSize: '24px' }}
                        onClick={() => handleRowClick(row.examName, row.examPath)}

                    />
                    //         <img
                    //         src="https://storage.cloud.google.com/exams-bucket/46341d91-e28b-4779-9a7c-26ba3f88e8ae.png"
                    //         alt={row.examName}
                    //         style={{ width: '50px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                    // onClick={() => handleRowClick(row.examName,`https://storage.cloud.google.com/exams-bucket/46341d91-e28b-4779-9a7c-26ba3f88e8ae.png`)} 

                    //         // onClick={() => window.open("/a.png", "_blank")}
                    //     />
                )}
            </TableCell>
            <TableCell sx={{ color: 'rgb(75, 75, 75)', alignItems: 'center' }}>
                {isFolder ? row.folderName : row.examName}

            </TableCell>

            <TableCell align='right' sx={{ width: '300px' }}>
                {isHovered && (
                    <ExamRowButtons examId={row.id} fileName={row.examName} />
                )}
            </TableCell>
            <TableCell
            
                sx={{ color: 'rgb(75, 75, 75)' }}
                onMouseEnter={() => setIsHovered(false)}
            >
                
                shared
            </TableCell>

            <TableCell
                sx={{ color: 'rgb(75, 75, 75)' }}
                onMouseEnter={() => setIsHovered(false)}
            >
                {formattedUpdatedAt}
            </TableCell>

            <TableCell
                align="right"
                sx={{ padding: 0 }}
                onMouseEnter={() => setIsHovered(false)}
            >
                <Button
                    onClick={(event) => handleMenuClick(event, index)}
                    sx={{ marginLeft: 1 }}
                >
                    <MoreVertIcon />
                </Button>
                <FileMenu
                    anchorEl={anchorEl}
                    selectedRow={selectedRow}
                    handleMenuClose={handleMenuClose}
                    uniqueFileName={row.uniqueFileName}
                    examName={row.examName}
                    id={row.id}
                    openModal={openModal}
                />
            </TableCell>
        </TableRow>
    );
};

export default ExamDetailsRow;
