import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  CssBaseline,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ImageIcon from "@mui/icons-material/Image";
import DownloadIcon from "@mui/icons-material/Download";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { motion } from "framer-motion";

export default function SnapGenAI() {
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const savedMode = localStorage.getItem("snapgen-theme");
    if (savedMode) setDarkMode(savedMode === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("snapgen-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#90caf9" : "#0d47a1",
      },
      secondary: {
        main: darkMode ? "#f48fb1" : "#f50057",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });

  const handleGenerate = async () => {
    setLoading(true);
    setCaption("");
    setImage("");

    try {
      const response = await fetch("http://localhost:5001/api/generate-image-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.error) {
        setSnackbarMessage("Failed to generate content.");
        setSnackbarOpen(true);
      } else {
        setCaption(data.caption);
        setImage(data.image);
      }
    } catch (err) {
      setSnackbarMessage("An unexpected error occurred.");
      setSnackbarOpen(true);
      console.error(err);
    }

    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "ai-generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: darkMode ? "brightness(0.5)" : "brightness(0.75)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          >
            <source src="/bg.mp4" type="video/mp4" />
          </video>
        </Box>

        <AppBar position="static" sx={{ zIndex: 2 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <ImageIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              SnapGen AI
            </Typography>
            <Tooltip title="Toggle Dark/Light Mode">
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            position: "relative",
            px: 2,
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              backgroundColor: darkMode ? "rgba(18,18,18,0.85)" : "rgba(255,255,255,0.9)",
              borderRadius: 3,
              p: { xs: 2, sm: 4 },
              boxShadow: 6,
            }}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                gap={3}
              >
                <Typography variant="h4" gutterBottom>
                  Create Stunning Posts with Ease
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  label="What's your idea?"
                  variant="outlined"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<PhotoCamera />}
                  onClick={handleGenerate}
                  disabled={loading}
                  sx={{ px: 4 }}
                >
                  Generate
                </Button>

                {loading && (
                  <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                  </Box>
                )}

                {!loading && image && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card sx={{ mt: 3, boxShadow: 4 }}>
                      <CardMedia component="img" height="400" image={image} alt="Generated" />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Caption:
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{caption}</Typography>
                        <Box display="flex" justifyContent="center" gap={2}>
                          <Tooltip title="Download Image">
                            <IconButton onClick={handleDownload} color="primary">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          </Container>
        </Box>

        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            bgcolor: darkMode ? theme.palette.background.paper : theme.palette.primary.main,
            color: darkMode ? "text.primary" : "#fff",
            zIndex: 2,
            position: "relative",
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Container maxWidth="md">
              <Divider sx={{ mb: 2, bgcolor: darkMode ? "divider" : "#fff" }} />
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: darkMode ? "text.secondary" : "#fff",
                  a: {
                    color: "#fff",
                    textDecoration: "none",
                    '&:hover': {
                      textDecoration: "underline",
                    },
                  },
                }}
              >
                © {new Date().getFullYear()} SnapGen AI. Built by{" "}
                <a
                  href="https://yourwebsite.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Saptaparno
                </a>
                .
              </Typography>
            </Container>
          </motion.div>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info" variant="filled" onClose={() => setSnackbarOpen(false)}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
