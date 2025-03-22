import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { ArrowBack, Download, ZoomIn, ZoomOut, Print, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ExamFileViewerProps {
    fileName: string;
    fileUrl: string;
    onDownload: () => void;
}

const ExamFileViewer = ({ fileName, fileUrl, onDownload }: ExamFileViewerProps) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box 
            sx={{ 
                width: '100vw', 
                height: '100vh', 
                display: 'flex', 
                backgroundColor: '#f4f4f4'
            }}
        >
            {/* Sidebar Toolbar */}
            <Box 
                sx={{ 
                    width: '60px', 
                    height: '100vh', 
                    backgroundColor: 'white', 
                    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                
                    left:0,
                    alignItems: 'center', 
                    paddingTop: '40px',
                     position: 'fixed',
                }}
            >
                <IconButton color="inherit" onClick={() => navigate(-1)}>
                    <ArrowBack />
                </IconButton>
                <IconButton color="inherit" onClick={onDownload}>
                    <Download />
                </IconButton>
                <IconButton color="inherit">
                    <ZoomIn />
                </IconButton>
                <IconButton color="inherit">
                    <ZoomOut />
                </IconButton>
                <IconButton color="inherit" onClick={() => window.print()}>
                    <Print />
                </IconButton>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <MoreVert />
                </IconButton>
                
                {/* Menu for More Options */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>View Exam Details</MenuItem>
                </Menu>
            </Box>
            
            {/* File Display */}
            <Box 
                component="img"
                src={fileUrl}
                alt={fileName}
                sx={{ 
                    flexGrow: 1, 
                    // height: '100vh', 
                    width:'100%',
                    objectFit: 'contain' 
                }}
            />
        </Box>
    );
};

export default ExamFileViewer;
