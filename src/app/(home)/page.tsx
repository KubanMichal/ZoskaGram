// src/app/(home)
"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  Stack,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';
import SchoolIcon from '@mui/icons-material/School';

//export const metadata = { title: 'Domovská stránka | KamNaKavu'};

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (session) {
      router.push('/prispevok');
    }
  }, [session, router]);

  if (!session) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #1a237e 30%, #311b92 90%)'
            : 'linear-gradient(45deg, #42a5f5 30%, #1976d2 90%)',
          pt: 8,
          pb: 12,
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 'bold',
                mb: 2,
                color: '#fff',
              }}
            >
              ZoškaSnap
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', md: '2rem' },
                mb: 4,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Sociálna sieť pre študentov SPŠE Zochova
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <PhotoCameraIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                  <Typography variant="h5" component="h3">
                    Zdieľaj momenty
                  </Typography>
                  <Typography color="text.secondary">
                    Zachyť a zdieľaj nezabudnuteľné okamihy z tvojho študentského života
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <PeopleIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                  <Typography variant="h5" component="h3">
                    Zostaň v spojení
                  </Typography>
                  <Typography color="text.secondary">
                    Buď v kontakte so spolužiakmi a vytváraj nové priateľstvá
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <ShareIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                  <Typography variant="h5" component="h3">
                    Zdieľaj znalosti
                  </Typography>
                  <Typography color="text.secondary">
                    Vymieňaj si skúsenosti a pomáhaj ostatným študentom rásť
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <SchoolIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                  <Typography variant="h5" component="h3">
                    Študentský život
                  </Typography>
                  <Typography color="text.secondary">
                    Objavuj všetko, čo ti študentský život na SPŠE Zochova ponúka
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          {/* Call to Action */}
          <Box textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 3,
                color: '#fff',
              }}
            >
              Pripoj sa k našej komunite
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Zaregistruj sa a staň sa súčasťou najväčšej študentskej komunity na SPŠE Zochova
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/auth/registracia')}
              sx={{
                fontSize: '1.2rem',
                px: 4,
                py: 1.5,
                backgroundColor: '#fff',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Začať teraz
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }
}

