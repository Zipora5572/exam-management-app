import axios from "../utils/axiosConfig"
import { ExamType } from "../models/Exam"

export default {
    uploadExamFile: async (file: File, examDetails: Partial<ExamType>) => {
        const formData = new FormData();
        formData.append('file', file);
        if (examDetails.userId !== undefined) formData.append('UserId', examDetails.userId.toString());
        if (examDetails.examName !== undefined) formData.append('ExamName', examDetails.examName);
        if (examDetails.examType !== undefined) formData.append('ExamType', examDetails.examType);
        if (examDetails.topic) {
            formData.append('Topic.Name', examDetails.topic.Name || '');
            formData.append('Topic.Description', examDetails.topic.Description || '');
        }
        console.log(examDetails.topic);

        // if (examDetails.folderId !== undefined) formData.append('FolderId', examDetails.folderId.toString());
        try {
            const response = await axios.post('storage/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw new Error('File upload failed: ' + error.message);
        }
    },
    download: async (fileName: string) => {
        try {
            const response = await axios.get(`/exam/download/${fileName}`, {
                responseType: 'blob', 
            });

           
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); 
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    }
    ,
    deleteExamFile: async (examId: string) => {
        try {
            const response = await axios.delete(`storage/${examId}`);
            return response.data;
        } catch (error) {
            throw new Error('File deletion failed: ' + error.message);
        }
    }
    ,
    getAllExams: async () => {
        try {

            const response = await axios.get('/exam');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch exams: ' + error.message);
        }
    },
    renameExamFile: async (id: number, newName: string) => {
        try {
            console.log(id + ' renamed' + newName);

            const response = await axios.patch(`/exam/rename/${id}`, newName, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to rename exam: ' + error.message);
        }
    },

}