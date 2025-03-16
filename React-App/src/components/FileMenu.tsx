import React, { useState, useEffect } from 'react';
import { Menu, MenuItem } from '@mui/material';

interface FileMenuProps {
    anchorEl: null | HTMLElement;
    selectedRow: number | null;
    handleMenuClose: () => void;
    examPath: string;
    examName: string;
    openModal: (data: { title: string; initialName?: string; setNewName?: (name: string) => void; confirmText?: string; onConfirm?: (name: string) => void; children?: React.ReactNode; }) => void;
}

const FileMenu: React.FC<FileMenuProps> = ({ anchorEl, selectedRow, handleMenuClose, examPath, examName, openModal }) => {
    const [newName, setNewName] = useState<string>(examName);

    useEffect(() => {
        setNewName(examName);
    }, [examName]);

    const handleDownload = () => {
        const fileId = "1yqsVCieVhfw9ibYc-U9orUIMaVhiK2YN";
        const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        const link = document.createElement('a');
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`Downloading ${examName}`);
        handleMenuClose();
    };

    const handleDelete = () => {
        openModal({
            title: 'Delete',
            children: (
                <div>
                    You and the people you shared this file with won't be able to access it once it has been deleted. The file will be permanently deleted, and this action can't be undone.
                </div>
            ),
            confirmText: 'Delete',
            onConfirm: () => {
                console.log(`Deleting row ${selectedRow}`);
                handleMenuClose();
            },
        });
    };

    const handleRename = () => {
        openModal({
            title: 'Rename',
            initialName: examName,
            setNewName: (name: string) => {
                setNewName(name);
            },
            confirmText: 'Rename',
            onConfirm: (updatedName: string) => {
                console.log(`Renaming to ${updatedName}`);
                handleMenuClose();
            },
        });
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRow !== null}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleDelete}>Delete Item</MenuItem>
            <MenuItem onClick={handleDownload}>Download</MenuItem>
            <MenuItem onClick={handleRename}>Rename</MenuItem>
        </Menu>
    );
};

export default FileMenu;