import axios from "../utils/axiosConfig";

const StudentService = {

    // העלאת רשימת תלמידים מקובץ Excel
    uploadStudentList: async (examDetails: { examId: number }, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('examId', examDetails.examId.toString());

            const response = await axios.post(`/Student/${examDetails.examId}/excel`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw new Error('העלאת רשימת תלמידים נכשלה: ' + error.message);
        }
    },

    
    getAllStudentsForExam: async (examId: number): Promise<any> => {
        try {
            const response = await axios.get(`/student/exam/${examId}`);
            return response.data;
        } catch (error) {
            throw new Error('שגיאה בקבלת תלמידים: ' + error.message);
        }
    },

    deleteStudent: async (studentId: number): Promise<any> => {
        try {
            const response = await axios.delete(`/students/${studentId}`);
            return response.data;
        } catch (error) {
            throw new Error('שגיאה במחקת תלמיד: ' + error.message);
        }
    },

    // עדכון פרטי תלמיד
    updateStudentDetails: async (studentId: number, studentData: any): Promise<any> => {
        try {
            const response = await axios.patch(`/students/${studentId}`, studentData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('שגיאה בעדכון פרטי תלמיד: ' + error.message);
        }
    }
};

export default StudentService;
