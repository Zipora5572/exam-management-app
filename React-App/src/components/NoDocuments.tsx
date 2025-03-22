import { Box, Typography } from '@mui/material';


export default function NoDocuments({folderId}:{folderId:number|null}) {
   

  return (
    <Box
      sx={{
        marginTop:'50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Typography sx={{fontWeight:'bold'}} variant="h5" component="h2" gutterBottom>
        No Exams yet
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Exams that you upload from any device will appear here.
      </Typography>
      <Box
        component="img"
        sx={{
          height: 150,
          width: 'auto',
          objectFit: 'contain',
          mt: 4,
          marginBottom: 5,
        }}
        alt="No Documents"
        src="./no-document.png"
      />
    
      
    </Box>
  );
}
