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
    Button,
    Menu,
    MenuItem,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const data = [
    { name: 'תשובון 89-ocr.pdf', type: 'PDF', sharing: 'Shared', modified: '2025-03-10' },
    { name: 'תשובון 90-ocr.pdf', type: 'PDF', sharing: 'Shared', modified: '2025-03-11' },
    { name: 'תשובון 91-ocr.pdf', type: 'PDF', sharing: 'Shared', modified: '2025-03-12' },
    // Add more document data here
];

const ExamList = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedRow, setSelectedRow] = React.useState(null);

    const handleMenuClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(index);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRow(null);
    };

    const handleDelete = () => {
        console.log(`Deleting row ${selectedRow}`);
        handleMenuClose();
    };
    const handleDownload = (fileName:string) => {
        const fileId = "1yqsVCieVhfw9ibYc-U9orUIMaVhiK2YN"; 
        const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        const link = document.createElement('a');
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Downloading ${fileName}`);
    };
    

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>
                    Your Exams
                </Typography>
                <div>
                    <Button
                        variant="contained"
                        style={{
                            marginLeft: 'auto',
                            borderRadius: '20px',
                            border: '2px solid black',
                            fontWeight: 'bold',
                            color: 'black',
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            marginRight: '8px',
                        }}
                        startIcon={<FolderIcon />}
                    >
                        Create Folder
                    </Button>
                    <Button
                        variant="contained"
                        style={{
                            marginLeft: 'auto',
                            borderRadius: '20px',
                            border: '2px solid black',
                            fontWeight: 'bold',
                            color: 'black',
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                        }}
                        startIcon={<UploadIcon />}
                    >
                        Upload File
                    </Button>
                </div>
            </div>
            <TableContainer component={Paper} style={{ boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Document Name</TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Type</TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Sharing</TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Modified</TableCell>
                            <TableCell style={{ border: 'none', color: 'rgb(110, 110, 110)', fontWeight: "bold" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ border: '1px solid #e0e0e0' }}>
                        {data.map((row, index) => (
                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>{row.name}</TableCell>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>{row.type}</TableCell>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>{row.sharing}</TableCell>
                                <TableCell sx={{ color: 'rgb(75, 75, 75)' }}>{row.modified}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => console.log(`Checking exam ${row.name}`)}>Check Exam</Button>
                                    <Button
                                        onClick={(event) => handleMenuClick(event, index)}
                                        sx={{ marginLeft: 1 }}
                                    >
                                        <MoreVertIcon />
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && selectedRow === index}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem onClick={() => handleDownload(row.name)}>Download</MenuItem>

                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ExamList;
