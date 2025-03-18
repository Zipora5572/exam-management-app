
import { IconButton, Tooltip } from "@mui/material";
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
    <Tooltip title="Copy link">
      <IconButton onClick={handleCopy} color="primary">
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboard;
