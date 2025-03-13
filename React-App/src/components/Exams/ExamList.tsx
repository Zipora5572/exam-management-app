import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
const data = [
    { name: 'תשובון 89-ocr.pdf', type: 'PDF', sharing: 'Shared', modified: '2025-03-10' },
    { name: 'תשובון 89-ocr.pdf', type: 'PDF', sharing: 'Shared', modified: '2025-03-10' },
    { name: 'תשובון 89-ocr.pdf', type: 'PDF', sharing: 'Shared', modified: '2025-03-10' },
    // Add more document data here
];

const ExamList = () => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>
                    Your Exams
                </Typography>
                <Button
                    variant="contained"
                    style={{
                       
                        marginLeft: 'auto',
                        borderRadius: '20px', 
                        border: '2px solid black', 
                        fontWeight: 'bold', 
                        color: 'black',
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    }}
                    startIcon={<UploadIcon />} 
                >
                    Upload File
                </Button>
            </div>
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ border: 'none' ,color:'rgb(110, 110, 110)',fontWeight:"bold" }}>Document Name</TableCell>
                            <TableCell style={{ border: 'none' ,color:'rgb(110, 110, 110)',fontWeight:"bold" }}>Type</TableCell>
                            <TableCell style={{ border: 'none' ,color:'rgb(110, 110, 110)',fontWeight:"bold" }}>Sharing</TableCell>
                            <TableCell style={{ border: 'none' ,color:'rgb(110, 110, 110)',fontWeight:"bold" }}>Modified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ border: '1px solid #e0e0e0' }}>
                        {data.map((row, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{color:'rgb(75, 75, 75)'}}>{row.name}</TableCell>
                                <TableCell sx={{color:'rgb(75, 75, 75)'}}>{row.type}</TableCell>
                                <TableCell sx={{color:'rgb(75, 75, 75)'}}>{row.sharing}</TableCell>
                                <TableCell sx={{color:'rgb(75, 75, 75)'}}>{row.modified}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ExamList;
