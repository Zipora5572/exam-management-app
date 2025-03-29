import  { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Line } from 'react-konva';
import { Box, Paper, Typography, IconButton, Tooltip, Divider, TextField, Button } from '@mui/material';
import { CheckCircleOutline, Delete, Edit, HighlightOff, LocalFireDepartment, Save } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, StoreType } from '../../store/store';
import { getStudentExamsByExamId } from '../../store/studentExamSlice';
import { useLocation } from 'react-router-dom';
import studentExamsService from "../../services/StudentExamService"
import FileSaver from 'file-saver';
import axios from 'axios';

const ExamFileViewer = () => {
    const stageRef = useRef(null); 
    const [dragging, setDragging] = useState(false);
    const [templatePosition, setTemplatePosition] = useState({ x: 0, y: 0 });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [markedAnswers, setMarkedAnswers] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [image] = useState(new window.Image());
    const location = useLocation();
    const { exam } = location.state || {};
    const [score, setScore] = useState(exam.score);
    const [isTemplateDragged, setIsTemplateDragged] = useState(false);
    const [isEditingScore, setIsEditingScore] = useState(false);
    const [isEditingEvaluation, setIsEditingEvaluation] = useState(false);
    const [evaluation, setEvaluation] = useState(exam.teacherComments || '');
   
    const [imageBlob, setImageBlob] = useState(null);
    image.src = exam.examPath;
   
   

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getStudentExamsByExamId(exam.examId));
    }, [dispatch, exam.examId]);


    const studentExams = useSelector((state: StoreType) => state.studentExams.exams);

    const scoreDistribution = studentExams.map(studentExam => ({
        student: studentExam.studentExamName,
        score: studentExam.score,
    }));

    const currentStudentName = exam.studentExamName;

    const chartData = {
        labels: scoreDistribution.map(item => item.student),
        datasets: [
            {
                label: 'Score Comparison',
                data: scoreDistribution.map(item => item.score),
                backgroundColor: scoreDistribution.map(item =>
                    item.student === currentStudentName
                        ? 'rgba(255, 99, 132, 0.5)'
                        : 'rgba(75, 192, 192, 0.5)'
                ),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };
    
    const templates = [
        { id: 'V', points: [20, 0, 2, 10, 0, 0],  icon: <CheckCircleOutline fontSize="large" color="success" /> },
        { id: 'X', points: [0, 0, 10, 10, 20, 0, 10, 10, 20, 20, 10, 10, 0, 20], icon: <HighlightOff fontSize="large" color="error" /> }
    ];
   
    const handleSaveExam = async () => {
        try {
          
          
                await studentExamsService.updateStudentExam(exam.id, { 
                    ...exam,
                    score: score, 
                    teacherComments: evaluation 
                });
            }
     catch (error) {
            console.error("Error saving exam data:", error);
            alert("Failed to save exam data.");
        }
    };
 
    
    

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
    };

    const handleDragStart = (e) => {
        if (selectedTemplate) {
            setDragging(true);
            setTemplatePosition({ x: e.evt.offsetX, y: e.evt.offsetY });
        }
    };

    const handleDragMove = (e) => {
        if (!dragging || !selectedTemplate) return;
        setTemplatePosition({ x: e.evt.offsetX, y: e.evt.offsetY });
    };

    const handleDragEnd = () => {
        if (selectedTemplate) {
            setDragging(false);
            setMarkedAnswers((prev) => [
                ...prev,
                {
                    points: selectedTemplate.points.map((point, idx) =>
                        idx % 2 === 0 ? point + templatePosition.x : point + templatePosition.y
                    ),
                    color: 'red',
                    template: selectedTemplate.id,
                    score: 0,
                },
            ]);
            setIsTemplateDragged(true);
        }
    };

    const handlePointChange = (index, newPoints) => {
        const updatedAnswers = [...markedAnswers];
        updatedAnswers[index].score = newPoints;
        setMarkedAnswers(updatedAnswers);
    };

    const handleDeleteAnswer = (index) => {
        const updatedAnswers = [...markedAnswers];
        updatedAnswers.splice(index, 1);
        setMarkedAnswers(updatedAnswers);
    };

  
    const calculateScore = () => {

        const totalScore = markedAnswers.reduce((total, answer) => total + answer.score, 0);
        setScore(totalScore);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f7fa' }}>
{imageBlob && (
    <img src={URL.createObjectURL(imageBlob)} alt="Exam" style={{ width: '100%', height: 'auto' }} />
)}

            <Paper sx={{
                width: '350px', padding: 3, boxShadow: 3, backgroundColor: '#ffffff',
                height: '100%', overflowY: 'auto', position: 'fixed', left: 0, top: '64px', zIndex: 1
            }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', marginBottom: 2, textAlign: 'left' }}>Exam Details</Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography sx={{ textAlign: 'left' }}><strong>Student:</strong> {exam.studentExamName}</Typography>

                <Typography sx={{ textAlign: 'left' }}>
                    <strong>Score:</strong>
                    {isEditingScore ? (
                        <TextField
                            type="number"
                            value={score}
                            onChange={(e) => setScore(parseInt(e.target.value))}
                            onBlur={() => setIsEditingScore(false)}
                            size="small"
                        />
                    ) : (
                        <>
                            {score}
                            <IconButton onClick={() => setIsEditingScore(true)} size="small">
                                <Edit />
                            </IconButton>
                        </>
                    )}
                </Typography>
                <Typography sx={{ textAlign: 'left' }}>
                    <strong>Evaluation:</strong>
                    {isEditingEvaluation ? (
                        <TextField
                            value={evaluation}
                            multiline
                            onChange={(e) => setEvaluation(e.target.value)}
                            onBlur={() => setIsEditingEvaluation(false)}
                            fullWidth
                        />
                    ) : (
                        <>
                            {evaluation}
                            <IconButton onClick={() => setIsEditingEvaluation(true)} size="small">
                                <Edit />
                            </IconButton>
                        </>
                    )}
                </Typography>
                <Divider sx={{ marginY: 5 }} />




                <Typography variant="body2" sx={{ fontWeight: 'bold', textAlign: 'left' }}>Score Comparison:</Typography>
                <Bar data={chartData} options={{ responsive: true }} />
                <Divider sx={{ marginY: 3 }} />
                {!isChecking ? (
                    <Button onClick={() => setIsChecking(true)} fullWidth variant="contained" color="primary" startIcon={<Edit />}>
                        Check Exam Manually
                    </Button>
                ) : (
                    <Button onClick={handleSaveExam} fullWidth variant="contained" color="success" startIcon={<Save />}>
                        Save Exam Data
                    </Button>
                    
                )}
                   
            </Paper>


            {/* תצוגת מבחן */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center', // מרכז את התוכן
                paddingRight: '20px', // הוסף רווח פנימי מימין
                marginLeft: isChecking ? '200px' : '200px',
                transition: 'margin-left 0.3s ease'
            }}>
                <Stage
                  ref={stageRef} 
                    width={window.innerWidth - (isChecking ? 650 : 650) - 60}
                    height={window.innerHeight}
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}

                >
                    <Layer>
                        <Image image={image} width={window.innerWidth - (isChecking ? 650 : 650) - 60} height={window.innerHeight} />
                        {markedAnswers.map((answer, index) => (
                            <Line key={index} points={answer.points} stroke="red" strokeWidth={3} />
                        ))}
                    </Layer>
                </Stage>
            </Box>



            {isChecking && (
                <Box sx={{
                    width: '170px', padding: 3, backgroundColor: '#ffffff', position: 'fixed',
                    right: 0, top: '64px', zIndex: 1, boxShadow: 'none'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {templates.map((template) => (

                            <IconButton color="primary" onClick={() => handleSelectTemplate(template)} sx={{ marginBottom: 2 }}>
                                {template.icon}
                            </IconButton>

                        ))}
                    </Box>
                    <Divider sx={{ marginY: 2 }} />
                    {markedAnswers.map((answer, index) => (
                        <Box key={index} sx={{ marginBottom: 2, padding: 1, backgroundColor: '#f5f5f5' }}>
                            <Typography>Answer {index + 1} - {answer.template}</Typography>
                            <TextField label="Points" type="number" value={answer.score} onChange={(e) => handlePointChange(index, parseInt(e.target.value))} fullWidth variant="outlined" />
                            <IconButton onClick={() => handleDeleteAnswer(index)} color="error"><Delete /></IconButton>
                        </Box>
                    ))}
                    <Button onClick={calculateScore} variant="contained" color="primary" fullWidth>
                        Calculate Score
                    </Button>
                </Box>
            )}

        </Box>
    );
};

export default ExamFileViewer;
