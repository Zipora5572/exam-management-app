import { Button, Tooltip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import StarIcon from '@mui/icons-material/Star';
import CheckIcon from '@mui/icons-material/Check';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { toggleStarExamFile } from "../store/examSlice";
import Swal from 'sweetalert2';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import withReactContent from 'sweetalert2-react-content';
import { ExamFileType, ExamFolderType } from "../models/Exam";
import { toggleStarFolder } from "../store/folderSlice";
const ExamRowButtons = ({ row, starred }: { row:ExamFileType | ExamFolderType, starred: boolean }) => {

    const MySwal = withReactContent(Swal);

    const [isCopied, setIsCopied] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

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
        row.type=="FILE"?
        dispatch(toggleStarExamFile(row.id)):
        dispatch(toggleStarFolder(row.id));
    
        Swal.fire({
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 2000,
            background: '#d4edda',
            customClass: {
                popup: 'no-animation-toast',
            },
            didOpen: (toast) => {
                toast.style.margin = '0 auto';
                toast.style.left = '0';
                toast.style.right = '0';
                toast.style.width = 'fit-content'; 
                toast.style.bottom = '20px';
            },
            html: `
                <div style="display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: #155724;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#155724" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.08 0l3.992-3.992a.75.75 0 1 0-1.06-1.06L7.5 9.439 5.522 7.47a.75.75 0 0 0-1.044 1.076l2.492 2.49z"/>
                    </svg>
                    ${starred ? 'Removed from Starred' : 'Added to Starred'}
                </div>
            `,
            showClass: { popup: '' },
            hideClass: { popup: '' }
        });
        
    };
    
    const handleView = () => {

        navigate("students-exams", { state: { examId: row.id, examFileTeacherName: row } })
    };

    return (
        <>
            <Tooltip title={starred ? "Remove from Starred" : "Add to Starred"}>
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
                    {starred ? <StarIcon  /> : <StarBorderIcon />}

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
