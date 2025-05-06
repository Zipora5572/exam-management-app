import axios from "../utils/axiosConfig"
import { ExamFolderType, ExamType } from "../models/Exam"

export default {
    uploadExamFile: async (file: File, examDetails: Partial<ExamType>) => {
        const formData = new FormData();
        formData.append('file', file);
        if (examDetails.userId !== undefined) formData.append('UserId', examDetails.userId.toString());
        if (examDetails.name !== undefined) formData.append('name', examDetails.name);
        if (examDetails.examType !== undefined) formData.append('ExamType', examDetails.examType);
        let id=examDetails.folderId?examDetails.folderId.toString():'1'
        
        
        if (examDetails.folderId != null) formData.append('FolderId',id);
        if (examDetails.topic) {
           
            
            formData.append('Topic.Name', examDetails.topic.name || '');
            formData.append('Topic.Description', examDetails.topic.description || '');
        }
      

        // if (examDetails.folderId !== undefined) formData.append('FolderId', examDetails.folderId.toString());
        try {
            const response = await axios.post('exam/upload', formData, {
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
            const response = await axios.get(`/exam/download`, {
                params: {
                    fileNamePrefix: fileName 
                },
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
    deleteExamFile: async (id: number) => {
        try {
            const response = await axios.delete(`exam/${id}`);
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
    getAllFolders: async () => {
        try {

            const response = await axios.get('/folder');
         
            
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
   
    toggleStarExamFile: async (id: number) => {
        try {
            const response = await axios.patch(`/exam/${id}/toggle-star`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to toggle star: ' + error.message);
        }
    },
    
}
