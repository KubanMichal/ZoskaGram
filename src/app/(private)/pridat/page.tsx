// src/app/(private)/pridat/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import ImageIcon from '@mui/icons-material/Image';
import { createPost } from '@/app/actions/posts';

export default function AddPost() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Obrázok je príliš veľký. Maximálna veľkosť je 5MB.');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Prosím vyberte obrázok');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for the image upload
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);

      await createPost(formData);
      router.push('/prispevok');
      router.refresh();
    } catch (err) {
      setError('Nastala chyba pri pridávaní príspevku. Skúste to znova.');
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Pridať príspevok
      </Typography>

      <Card sx={{ mb: 3, position: 'relative' }}>
        {imagePreview ? (
          <CardMedia
            component="img"
            image={imagePreview}
            alt="Náhľad obrázku"
            sx={{ aspectRatio: '1/1', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              aspectRatio: '1/1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              borderRadius: 1,
            }}
          >
            <ImageIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography color="text.secondary">
              Kliknite pre výber obrázku
            </Typography>
          </Box>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
        />
      </Card>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Popis príspevku"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 3 }}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isSubmitting || !image}
          sx={{ mb: 2 }}
        >
          {isSubmitting ? 'Pridávam...' : 'Pridať príspevok'}
        </Button>
      </form>
    </Container>
  );
}
