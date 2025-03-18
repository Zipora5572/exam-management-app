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
    }
}