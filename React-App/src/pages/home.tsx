import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#ffffff", // רקע לבן
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#000000", // טקסט שחור
          position: "relative",
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Typography variant="h2" fontWeight="bold">
            Your Ultimate Exam Management Platform
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Store, share, and analyze exam files effortlessly.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 4, px: 5, py: 1.5, fontSize: "1.2rem", backgroundColor: "#000000", color: "#ffffff" }} // כפתור שחור עם טקסט לבן
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={4} color="#000000">
          Why Choose Our Platform?
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
            textAlign: "center",
          }}
        >
          {[
            { title: "Cloud Storage", desc: "Securely store and manage exam files in the cloud." },
            { title: "Easy Sharing", desc: "Share exams with teachers and students effortlessly." },
            { title: "Automated Grading", desc: "Analyze exam results with AI-powered grading." },
          ].map((feature, index) => (
            <Box key={index} sx={{ p: 3, backgroundColor: "#ffffff", borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h5" fontWeight="bold" color="#000000">
                {feature.title}
              </Typography>
              <Typography sx={{ mt: 1, color: "gray" }}>{feature.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundColor: "#ffffff", // רקע לבן
          color: "#000000", // טקסט שחור
          textAlign: "center",
          py: 6,
          mt: 8,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Ready to Simplify Your Exam Management?
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Join thousands of teachers and students using our platform.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3, px: 5, py: 1.5, fontSize: "1.2rem", backgroundColor: "#000000", color: "#ffffff" }} // כפתור שחור עם טקסט לבן
        >
          Sign Up Now
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
