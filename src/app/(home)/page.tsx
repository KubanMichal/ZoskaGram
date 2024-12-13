
// src/app/page.tsx


import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import NonAuthPageView from '@/sections/NonAuthHomeView';
import AuthPageView from '@/sections/AuthHomeView';


export const metadata = { title: "Domov | Kolcobos" };

export default async function Home() {
  const session = await getServerSession(authOptions);

  return session ? <AuthPageView session={session} /> : <NonAuthPageView />;
}


