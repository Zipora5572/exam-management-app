
import { Button, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const CopyToClipboard = ({ text }: { text: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    
  );
};

export default CopyToClipboard;
