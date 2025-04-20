import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Box, Typography, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { getStudentExamsByExamId, updateStudentExam } from '../store/studentExamSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';
import { StudentExamType } from '../models/Exam';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useLocation, useNavigate } from 'react-router-dom';
import studentExamsService from './../services/StudentExamService';

const StudentsExams = () => {
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
    const navigate = useNavigate();
    const location = useLocation();
    const { examId } = location.state || {};
    const { examFileTeacherName } = location.state || {};

    const dispatch = useDispatch<AppDispatch>();
    const [checkingStatus, setCheckingStatus] = useState<{ [key: string]: 'idle' | 'pending' | 'done' }>({});

    useEffect(() => {
        dispatch(getStudentExamsByExamId(examId));
    }, [dispatch, examId]);

    const studentExams = useSelector((state: StoreType) => state.studentExams.exams);
    const [selectedExams, setSelectedExams] = useState<StudentExamType[]>([]);

    const handleSelectExam = (exam: StudentExamType) => {
        setSelectedExams(prev =>
            prev.find(e => e.id === exam.id)
                ? prev.filter(e => e.id !== exam.id)
                : [...prev, exam]
        );
    };

    const isSelected = (exam: StudentExamType) => selectedExams.some(e => e.id === exam.id);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, examId: string) => {
        setAnchorEl((prev) => ({ ...prev, [examId]: event.currentTarget }));
    };

    const handleCloseMenu = (examId: string) => {
        setAnchorEl((prev) => ({ ...prev, [examId]: null }));
    };

    const handleViewExamDetails = (exam: StudentExamType) => {
        navigate('/viewExam', { state: { exam } });
    };

    const handleCheckExam = async (studentExam: StudentExamType) => {
        const examId = studentExam.id;
        setCheckingStatus(prev => ({ ...prev, [examId]: 'pending' }));
        try {
            const response = await studentExamsService.checkExam(studentExam.examNamePrefix, examFileTeacherName);
            dispatch(updateStudentExam({
                id: studentExam.id,
                studentExam: {
                    ...studentExam,
                    score: Number(response.grade?.replace('%', '')),
                    teacherComments: response.evaluation
                }
            }));
            setCheckingStatus(prev => ({ ...prev, [examId]: 'done' }));
        } catch (error) {
            console.error("Error checking exam:", error);
            setCheckingStatus(prev => ({ ...prev, [examId]: 'idle' }));
        }
    };
    
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <TableContainer component={Paper} sx={{ flex: selectedExams.length > 0 ? 0.83 : 1, transition: 'flex 0.3s ease' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    onChange={(e) =>
                                        setSelectedExams(e.target.checked ? studentExams : [])
                                    }
                                    checked={selectedExams.length === studentExams.length && studentExams.length > 0}
                                    indeterminate={selectedExams.length > 0 && selectedExams.length < studentExams.length}
                                />
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Is Checked?</TableCell>
                            <TableCell>Checked At</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {studentExams.map((exam) => (
                            <TableRow key={exam.id} hover>
                                <TableCell>
                                    <Checkbox
                                        checked={isSelected(exam)}
                                        onChange={() => handleSelectExam(exam)}
                                    />
                                </TableCell>
                                <TableCell>{exam.studentExamName}</TableCell>
                                <TableCell>{exam.isChecked ? '✅' : '❌'}</TableCell>
                                <TableCell>{exam.isChecked ? exam.checkedAt ? new Date(exam.checkedAt).toLocaleDateString() : "-" : "-"}</TableCell>
                                <TableCell>{exam.score ?? '-'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleOpenMenu(e, exam.id)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl[exam.id]}
                                        open={Boolean(anchorEl[exam.id])}
                                        onClose={() => handleCloseMenu(exam.id)}
                                    >
                                        <MenuItem onClick={() => handleViewExamDetails(exam)}>View Details</MenuItem>
                                        <MenuItem onClick={() => handleCheckExam(exam)} disabled={checkingStatus[exam.id] === 'pending'}>
    {checkingStatus[exam.id] === 'pending' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} /> Checking...
        </Box>
    ) : (
        "Check Exam"
    )}
</MenuItem>

                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* פאנל צדדי */}
            {selectedExams.length > 0 && (
                <Box
                    sx={{
                        width: '300px',
                        backgroundColor: '#f8f9fa',
                        padding: '16px',
                        borderLeft: '1px solid #ddd',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'width 0.3s ease',
                        overflowY: 'auto',
                        position: 'fixed',
                        right:0
                    }}
                >
                    {/* אייקון גדול + שם קובץ */}
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        {selectedExams.length === 1 ? (
                            selectedExams[0].isFolder ? (
                                <FolderIcon sx={{ fontSize: 64, color: '#666' }} />
                            ) : (
                                <InsertDriveFileIcon sx={{ fontSize: 64, color: '#666' }} />
                            )
                        ) : (
                            <InsertDriveFileIcon sx={{ fontSize: 64, color: '#666' }} />
                        )}
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {selectedExams.length === 1 ? selectedExams[0].studentExamName : `${selectedExams.length} Selected`}
                        </Typography>
                    </Box>

                    {/* פעולות */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Tooltip title="Download">
                            <IconButton>
                                <DownloadIcon /> <Typography sx={{ ml: 1 }}>Download</Typography>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Rename">
                            <IconButton>
                                <EditIcon /> <Typography sx={{ ml: 1 }}>Rename</Typography>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton>
                                <DeleteIcon /> <Typography sx={{ ml: 1 }}>Delete</Typography>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            )}
        </Box>
      
    );
};

export default StudentsExams;
