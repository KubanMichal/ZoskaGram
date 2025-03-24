// src/sections/SignUpView.tsx

"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  Link,
} from "@mui/material";
import { signIn } from "next-auth/react";
import GoogleIcon from "@mui/icons-material/Google";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SecurityIcon from "@mui/icons-material/Security";

export default function SignUpView() {
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
              backgroundColor: theme.palette.success.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 3,
            }}
          >
            <PersonAddIcon sx={{ fontSize: 32, color: "white" }} />
          </Box>
          
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: theme.palette.success.main
            }}
          >
            Vytvor si účet
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
            }}
          >
            Pripoj sa k ZoškaSnap komunite
          </Typography>

          {/* GDPR Notice */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 4,
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.mode === "dark" 
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(0, 0, 0, 0.03)",
            }}
          >
            <SecurityIcon color="info" />
            <Typography variant="body2" color="text.secondary" align="left">
              Prečítajte si naše{" "}
              <Link href="/gdpr" underline="hover" color="primary">
                GDPR podmienky
              </Link>
              {" "}pred registráciou
            </Typography>
          </Box>

          {/* Google Sign Up Button */}
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
            Registrovať sa účtom Google
          </Button>

          {/* Sign In Link */}
          <Typography variant="body2" sx={{ mt: 3, color: "text.secondary" }}>
            Už máš účet?{" "}
            <Link href="/auth/prihlasenie" underline="hover" color="primary">
              Prihlás sa
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

