// src/app/o-mne/page.tsx

'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';

export default function AboutPage() {
  const theme = useTheme();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Technológie',
      description: 'Postavené na moderných technológiách ako Next.js, React, Material-UI a Prisma, s dôrazom na výkon a používateľský zážitok.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Bezpečnosť',
      description: 'Vaše súkromie je našou prioritou. Implementovali sme pokročilé bezpečnostné opatrenia na ochranu vašich údajov.'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Vzdelávanie',
      description: 'Podporujeme vzájomné zdieľanie znalostí a skúseností medzi študentmi, čím vytvárame prostredie pre spoločný rast.'
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Komunita',
      description: 'Budujeme silnú komunitu študentov SPŠE Zochova, kde každý môže nájsť svoje miesto a prispieť k spoločnému rozvoju.'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)'
          : 'linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)',
        pt: 8,
        pb: 12,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box textAlign="center" mb={8}>
          <Avatar
            sx={{
              width: 150,
              height: 150,
              margin: '0 auto',
              mb: 3,
              border: '4px solid white',
            }}
            alt="Michal Kubán"
            src="/path-to-your-photo.jpg"
          >
            MK
          </Avatar>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
              mb: 2,
              color: '#fff',
            }}
          >
            O projekte ZoškaSnap
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Vytvorené študentmi pre študentov SPŠE Zochova
          </Typography>
        </Box>

        {/* Project Description */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography variant="h4" gutterBottom color="primary">
            Príbeh ZoškaSnap
          </Typography>
          <Typography variant="body1" paragraph>
            ZoškaSnap vznikol ako študentský projekt s cieľom vytvoriť jedinečnú platformu pre študentov SPŠE Zochova. 
            Našou víziou je prepojiť študentskú komunitu a vytvoriť priestor, kde môžeme zdieľať naše zážitky, 
            skúsenosti a podporovať sa navzájom v našej vzdelávacej ceste.
          </Typography>
        </Paper>

        {/* Features Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.9)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  {feature.icon}
                  <Typography variant="h5" component="h3" color="primary">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2">
                    {feature.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Developer Info */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Typography variant="h4" gutterBottom color="primary">
            O vývojárovi
          </Typography>
          <Typography variant="body1" paragraph>
            Som Michal Kubáň, študent SPŠE Zochova. Tento projekt vznikol ako súčasť mojej 
            snahy vytvoriť niečo užitočné pre našu školu a jej študentov. Verím v silu 
            komunity a technológií pri vytváraní lepšieho vzdelávacieho prostredia.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
