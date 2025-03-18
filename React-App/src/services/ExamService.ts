import axios from "../utils/axiosConfig"

export default{
 uploadExamFile : async (file: File, examDetails: { name: string; description: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', examDetails.name);
    formData.append('description', examDetails.description);
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
}}