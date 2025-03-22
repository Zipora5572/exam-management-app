import { StudentExamType } from "../models/Exam";
import axios from "../utils/axiosConfig";

const StudentExamService = {
   

    checkExam : async (studentExamImage: string, teacherExamImage: string, studentEmail: string) => {
       
        try {
            const response = await axios.post('http://localhost:5000/grade', {
                student_exam_name: studentExamImage,
                teacher_exam_name: teacherExamImage,
                student_email: studentEmail, 
            });
            
            return response.data 
        
        } catch (error) {
          console.error(error);
        } 
    }
,

    getAllStudentExams: async () => {
        try {
            const response = await axios.get(`/studentExam`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all student exams:", error);
            throw error; // לזרוק את השגיאה כדי שהקוד הקורא יוכל לטפל בה
        }
    },


    getStudentExamById: async (id: number) => {
        try {
            const response = await axios.get(`studentExam/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching student exam with ID ${id}:`, error);
            throw error;
        }
    },

   
    getStudentExamsByExamId: async (examId: number) => {
        try {
            const response = await axios.get(`studentExam/exam/${examId}`);
           
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching student exams for exam ID ${examId}:`, error);
            throw error;
        }
    },

   
    addStudentExam: async (studentExam: Partial<StudentExamType>) => {
        try {
            const response = await axios.post('/studentExam', studentExam);
            return response.data;
        } catch (error) {
            console.error("Error adding student exam:", error);
            throw error;
        }
    },

   
    updateStudentExam: async (id: number, studentExam: Partial<StudentExamType>) => {
        try {
            const response = await axios.put(`studentExam/${id}`, studentExam);
            return response.data;
        } catch (error) {
            console.error(`Error updating student exam with ID ${id}:`, error);
            throw error;
        }
    },

   
    deleteStudentExam: async (id: number) => {
        try {
            await axios.delete(`studentExam/${id}`);
        } catch (error) {
            console.error(`Error deleting student exam with ID ${id}:`, error);
            throw error;
        }
    }
};

export default StudentExamService;

