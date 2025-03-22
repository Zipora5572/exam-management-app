import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, StoreType } from '../store/store';

import useGradeExam from '../hooks/useGradeExam';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { getStudentExamsByExamId,updateStudentExam } from '../store/studentExamSlice';
import studentExamsService from "./../services/StudentExamService"
const StudentsExams = () => {
    const location = useLocation();
    const { examId,examFileTeacherName } = location.state || {}; 
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: StoreType) => state.auth.user);
    const studentExams = useSelector((state: StoreType) => state.studentExams.exams);
 
    const userId = user?.id;
    const { gradeExam, loading, error, grade, evaluation,studentExam } = useGradeExam(); 

    useEffect(() => {
        dispatch(getStudentExamsByExamId(examId));
       
        
    }, [dispatch, examId]);
console.log(studentExams);

    const handleCheckExam = async (studentExam) => {
        const studentExamImage = 'w.png';
        const teacherExamImage =`${examFileTeacherName}.png`
        const studentEmail = studentExam.email; 
        const response= await studentExamsService.checkExam(studentExamImage,teacherExamImage,studentEmail)
       
        dispatch(updateStudentExam({id:studentExam.id, studentExam:{ ...studentExam, score:Number(response.grade?.replace('%', '')), teacherComments: response.evaluation }}));

        // await gradeExam(studentExamImage, teacherExamImage, studentEmail); 
        studentExam.grade = Number(grade?.replace('%', '')); 
        studentExam.evaluation = evaluation;
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Student Name</TableCell>
                     <TableCell>Is Checked</TableCell>
                     <TableCell>Checked At</TableCell>
                     <TableCell>Score</TableCell>
                    <TableCell> </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {studentExams.map((studentExam) => (
                        <TableRow key={studentExam.id}>
                            <TableCell>{studentExam.student.firstName} {studentExam.student.lastName}</TableCell>
                            <TableCell>{studentExam.isChecked ? 'V' : 'X'}</TableCell>
                            <TableCell>{studentExam.isChecked ? studentExam.checkedAt ? new Date(studentExam.checkedAt).toLocaleDateString() : "-" : "-"}</TableCell>

                            <TableCell>{studentExam.isChecked ? studentExam.score : "-"}</TableCell>

                            <TableCell>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => handleCheckExam(studentExam)} 
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
