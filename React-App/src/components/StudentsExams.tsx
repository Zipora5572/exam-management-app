import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import { StudentExamType } from '../models/Exam';
import useGradeExam from '../hooks/useGradeExam'; // הייבוא של ה-Hook
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const StudentsExams = () => {
    const user = useSelector((state: StoreType) => state.auth.user);
    const location = useLocation();
    const  examTeacherPath  = location.state || {}
    const userId = user?.id;
    const { gradeExam, loading, error, grade, evaluation } = useGradeExam(); 
    const studentExams: StudentExamType[] = [
        {
            id: 1,
            topicName: 'Math',
            teacherId: user?.id,
            examPath: "C:\\Users\\user1\\Desktop\\ציפי לימודים שנה ב\\מבחנים לניסוי\\a.png",
            examName: 'מבחן מתמטיקה',
            sharing: false,
            userId: userId,
            modified: "2023-10-10",
            studentDetails: {
                id: userId,
                name: 'יוסי כהן',
                email:"z0548545572@gmail.com",
            },
            grade: undefined,
        },
        // הוסף מבחנים נוספים כאן
    ];

    const handleCheckExam = async (exam) => {//יש לשים לב לטיפוסים
        const studentExamImage = "C:\\Users\\user1\\Desktop\\ציפי לימודים שנה ב\\מבחנים לניסוי\\a.png"; 
        const teacherExamImage = examTeacherPath;
        
        const studentEmail = exam.studentDetails.email; 
        
        await gradeExam(studentExamImage, teacherExamImage, studentEmail); 
        exam.grade =Number(grade?.replace('%', '')) 
        exam.evaluation = evaluation;
    };
   

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>שם תלמיד</TableCell>
                        <TableCell>האם המבחן בדוק</TableCell>
                        <TableCell>תאריך בדיקה</TableCell>
                        <TableCell>פרטי בדיקה</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {studentExams.map((exam) => (
                        <TableRow key={exam.id}>
                            <TableCell>{exam.studentDetails?.firstName}</TableCell>
                            <TableCell>{exam.grade ? 'כן' : 'לא'}</TableCell>
                            <TableCell>{exam.modified}</TableCell>
                            <TableCell>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => handleCheckExam(exam)} 
                                    disabled={loading}
                                >
                                    {loading ? 'Checking...' : 'Check Exam'}
                     </Button>
                                {error && <div style={{ color: 'red' }}>{error}</div>}
                                {grade && <div>Grade: {grade}</div>}
                                {evaluation && <div>Evaluation: {evaluation}</div>} 
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default StudentsExams;
