// src/app/(home)
"use client";
 
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
 
//export const metadata = { title: 'Domovská stránka | KamNaKavu'};
 
export default function Home() {
  const { data: session} = useSession();
  const router = useRouter();
 
  useEffect(() => {
    if (session) {
      // Redirect to '/prispevky' after session is available
      router.push('/prispevok');
    }
  }, [session, router]);
  if (!session) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h3" align="center"><strong>Neprihlásený</strong> používateľ</Typography>
        <Typography variant="h5" align="center">ak chceš pokračovať, prosím <strong>prihlás sa</strong> alebo si <strong>sprav účet</strong> na našej stránke.</Typography>
      </Box>        
      );
  }
    }

