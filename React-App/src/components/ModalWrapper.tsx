import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, Button, TextField } from '@mui/material';

interface ModalWrapperProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    onConfirm?: (name: string) => void;
    confirmText?: string;
    initialName?: string;
    setNewName?: (name: string) => void;
    children?: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ open, handleClose, title, onConfirm, confirmText, initialName, setNewName, children }) => {
    const [newName, setModalNewName] = useState<string>(initialName || '');

    useEffect(() => {
        if (initialName !== undefined) {
            setModalNewName(initialName);
        }
    }, [initialName]);

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm(newName);
        }
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    {title}
                </Typography>
                <Box sx={{ borderBottom: '1px solid lightgray', mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                    {initialName !== undefined ? (
                        <TextField
                            label="New Name"
                            value={newName}
                            onChange={(e) => {
                                setModalNewName(e.target.value);
                                if (setNewName) {
                                    setNewName(e.target.value);
                                }
                            }}
                            fullWidth
                        />
                    ) : (
                        children
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: "30px" }}>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        sx={{
                            bgcolor: 'white',
                            border: '1px solid lightgray',
                            borderRadius: '5px',
                            '&:hover': {
                                bgcolor: 'lightgray',
                                color: 'white',
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleConfirm}
                        sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                        }}
                    >
                        {confirmText || 'Submit'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalWrapper;