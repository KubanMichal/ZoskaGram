// src/sections/NonAuthPageView.tsx

"use client"

import React from 'react';
import { Container, Typography } from '@mui/material';


export default function NonAuthPageView() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to Zochook
      </Typography>
      <Typography variant="body1" paragraph>
        Prosim prihlaste sa pre plny pristup.
      </Typography>
      
    </Container>
  );
}
