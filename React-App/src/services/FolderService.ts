import axios from "../utils/axiosConfig"
import { ExamFolderType, ExamType } from "../models/Exam"

export default {
   
    createFolder: async (folderDetails: Partial<ExamFolderType>): Promise<any> => {
        try {
            const response = await axios.post('/folder', folderDetails, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Folder creation failed: ' + error.message);
        }
    },

    
    deleteFolder: async (id: number) => {
        try {
            const response = await axios.delete(`folder/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Folder deletion failed: ' + error.message);
        }
    }
    ,
    getAllFolders: async () => {
        try {

            const response = await axios.get('/folder');
         
            
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch exams: ' + error.message);
        }
    },
    renameFolder: async (id: number, newName: string) => {
        try {
            const response = await axios.patch(`/folder/rename/${id}`, newName, {
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