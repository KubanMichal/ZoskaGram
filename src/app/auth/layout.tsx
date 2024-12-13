// src\app\auth\layout.tsx

import { Box } from '@mui/material';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh', // Ensure it takes up the full viewport height
        display: 'flex',
        justifyContent: 'center', // Horizontally center
        alignItems: 'center', // Vertically center
      }}
    >
      {children}
    </Box>
  );
}