import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Môj profil | ZoškaSnap',
  description: 'Správa vášho profilu na ZoškaSnap',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 