import { Button, Tooltip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StarIcon from '@mui/icons-material/Star'; 
import CheckIcon from '@mui/icons-material/Check'; 
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ExamRowButtons = ({fileName,examId}:{fileName:string,examId:number}) => {
    const [isCopied, setIsCopied] = useState(false); 

    const navigate=useNavigate()

    const handleCopy = async () => {     
        try {         
            await navigator.clipboard.writeText(`https://storage.cloud.google.com/exams-bucket/${fileName}`);
            setIsCopied(true); 
            setTimeout(() => {
                setIsCopied(false);
            }, 500);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    const handleAddToStar = () => {
      
        alert("Added to Star!");
    };
    const handleView = () => {
      
        navigate("students-exams", { state: { examId:examId ,examFileTeacherName:fileName } })
    };

    return (
        <>
            <Tooltip title="Add to Starred">
                <Button sx={{
                    backgroundColor: '#fcfcfc',
                    color: 'rgb(150, 150, 150)',
                    borderColor: 'rgb(150, 150, 150)',
                    '&:hover': {
                        color: 'black',
                        backgroundColor: '#fcfcfc',
                        borderColor: 'rgb(150, 150, 150)',
                    },
                    width: "10px",
                    fontSize: "10px",
                    marginLeft: "5px",
                }} onClick={handleAddToStar} color="primary">
                    <StarIcon />
                </Button>
            </Tooltip>
          
            <Tooltip title="Copy link">
                <Button sx={{
                    backgroundColor: '#fcfcfc',
                    color: 'rgb(150, 150, 150)',
                    borderColor: 'rgb(150, 150, 150)',
                    '&:hover': {
                        color: 'black',
                        backgroundColor: '#fcfcfc',
                        borderColor: 'rgb(150, 150, 150)',
                    },
                    width: "10px",
                    fontSize: "10px",
                    marginLeft: "5px",
                }} onClick={handleCopy} color="primary">
                    {isCopied ? <CheckIcon /> : <ContentCopyIcon />} 
                </Button>
            </Tooltip>
           
            <Tooltip title="View students exams">
                <Button sx={{
                    backgroundColor: '#fcfcfc',
                    color: 'rgb(150, 150, 150)',
                    borderColor: 'rgb(150, 150, 150)',
                    '&:hover': {
                        color: 'black',
                        backgroundColor: '#fcfcfc',
                        borderColor: 'rgb(150, 150, 150)',
                    },
                    width: "10px",
                    fontSize: "10px",
                    marginLeft: "5px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    margin: "5px"
                }} color="primary"
                onClick={handleView}
                >
                    <VisibilityIcon />
                
                </Button>
            </Tooltip>
        </>
    );
}

export default ExamRowButtons;
