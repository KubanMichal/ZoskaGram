// src/sections/SignInView.tsx

"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";

export default function SignInView() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#2196f3",
        display: "flex",
        alignItems: "center",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            background: theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.8)"
              : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Icon and Title */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 32, color: "white" }} />
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: theme.palette.primary.main
            }}
          >
            Vitajte späť!
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
            }}
          >
            Prihláste sa do svojho účtu ZoškaSnap
          </Typography>

          {/* Google Sign In Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={() => signIn("google")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 500,
              boxShadow: theme.shadows[4],
              bgcolor: "#4285f4",
              '&:hover': {
                bgcolor: "#3367d6",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            Prihlásiť sa účtom Google
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

