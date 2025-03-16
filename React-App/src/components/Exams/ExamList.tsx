import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import { ExamFileType, ExamFolderType, ExamType } from '../../models/Exam';
import { useSelector } from 'react-redux';
import { StoreType } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import ModalWrapper from '../ModalWrapper';
import FileMenu from '../FileMenu';
import ActionButtons from '../ActionButtons';

const initialData: (ExamFileType | ExamFolderType)[] = [
    {
        id: 1,
        folderName: "Folder 1",
        type: 'folder',
        children: [
            {
                id: 2,
                userId: 1,
                examName: "Math Exam",
                topicName: "Algebra",
                sharing: true,
                modified: "2023-10-01",
                teacherId: 1,
                examPath: "C:\\Users\\user1\\Desktop\\ציפי לימודים שנה ב\\מבחנים לניסוי\\a.png",
                parentId: 1,
                type: 'file',
            },
            {
                id: 3,
                folderName: "Subfolder 1",
                type: 'folder',
                parentId: 1,
                children: [],
            },
        ],
    },
    {
        id: 4,
        folderName: "Folder 2",
        type: 'folder',
        children: [],
    },
    {
        id: 5,
        userId: 1,
        examName: "Math Exam",
        topicName: "Algebra",
        sharing: true,
        modified: "2023-10-01",
        teacherId: 1,
        examPath: "C:\\Users\\user1\\Desktop\\ציפי לימודים שנה ב\\מבחנים לניסוי\\a.png",
        parentId: 1,
        type: 'file',
    },
];

const ExamList: React.FC = () => {
    const [data, setData] = useState(initialData); // מצב לאחסון הנתונים
    const [openFolderId, setOpenFolderId] = useState<number | null>(null);
    const user = useSelector((state: StoreType) => state.auth.user);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
    const { isOpen, openModal, closeModal, modalData } = useModal();
    const navigate = useNavigate();

    const handleFolderClick = (folderId: number) => {
        setOpenFolderId(openFolderId === folderId ? null : folderId);
    };

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>
                    Your Exams
                </Typography>
                <ActionButtons data={data} setData={setData} openModal={openModal} modalData={modalData} />
            </div>
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}></TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Exam Name</TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}></TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Modified</TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ border: '1px solid #e0e0e0' }}>
                        {data.map((row, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>
                                    {row.type === 'folder' ? (
                                        <FolderIcon
                                            style={{ color: 'rgb(144, 144, 144)', fontSize: '24px', cursor: 'pointer' }}
                                            onClick={() => handleFolderClick(row.id)}
                                        />
                                    ) : (
                                        <img
                                            src="/a.png"
                                            alt={row.examName}
                                            style={{ width: '50px', height: 'auto', marginRight: '8px', cursor: 'pointer' }}
                                            onClick={() => window.open("/a.png", "_blank")}
                                        />
                                    )}
                                </TableCell>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)', alignItems: 'center' }}>
                                    {/* {row.examName} */}
                                    
                                </TableCell>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>{row.sharing}</TableCell>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>{row.modified}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/exams/students-exams', { state:"C:\\Users\\user1\\Desktop\\ציפי לימודים שנה ב\\מבחנים לניסוי\\a.png" })}
                                    >
                                        view students exams
                                    </Button>
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
                                        examPath={row.examPath}
                                        examName={row.examName}
                                        openModal={openModal}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
            {openFolderId !== null && (
                <div>
                    {data.find(item => item.id === openFolderId)?.children.map((file, index) => (
                        <div key={index}>
                            <Typography>{file.examName || file.folderName}</Typography>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ExamList;