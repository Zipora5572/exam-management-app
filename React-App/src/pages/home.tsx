import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          marginTop: "64px",
          display: "flex", // שימוש ב-flex לסידור התוכן
          height: "80vh",
          alignItems: "stretch", // מתיחה של התוכן לגובה המלא
        }}
      >
        <Box
          sx={{
            flex: 1,
            padding: 4,
            backgroundColor: "#f5f5f5", // צבע רקע אפור חלש מאוד
            boxShadow: "none", // הסרת הצל
            display: "flex", // שימוש ב-flex לסידור הכיתוב
            flexDirection: "column", // סידור הכיתוב בעמודה
            justifyContent: "center", // ממרכז את הכיתוב
            alignItems: "center", // ממרכז את הכפתור
          }}
        >
          <Typography variant="h2" fontWeight="bold" align="center">
            Your Ultimate Exam Management Platform
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }} align="center">
            Store, share, and analyze exam files effortlessly.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 4,
              px: 5,
              py: 1.5,
              fontSize: "1.2rem",
              backgroundColor: "#000000",
              color: "#ffffff",
              // הכפתור ממוקם במרכז
            }}
          >
            Get Started
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            backgroundImage: 'url("./exam.png")', // ודא שהנתיב לתמונה נכון
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%", // קובע גובה של 100% כדי למלא את הקטע
          }}
        />
      </Box>
    </Box>
  );
};

export default Home;
