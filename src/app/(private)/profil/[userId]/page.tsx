'use client';

import { useEffect, useState } from 'react';
import { Container, Box, Typography, Avatar, Grid, Card, CardMedia, CardContent, Skeleton } from '@mui/material';
import { User, Profile, Post } from '@prisma/client';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { fetchUserProfile } from '@/app/actions/users';

type UserWithProfileAndPosts = User & {
  profile: Profile | null;
  posts: Post[];
};

export default function UserProfile({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<UserWithProfileAndPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await fetchUserProfile(params.userId);
        setUser(userData);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [params.userId]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Skeleton variant="circular" width={150} height={150} sx={{ mb: 2 }} />
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography color="error">
            {error || 'User not found'}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={user.image || user.profile?.avatarUrl || undefined}
            alt={user.name || ''}
            sx={{ width: 150, height: 150, mb: 2 }}
          >
            {user.name?.charAt(0)}
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {user.name}
          </Typography>
          {user.profile?.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography>{user.profile.location}</Typography>
            </Box>
          )}
          {user.profile?.bio && (
            <Typography variant="body1" textAlign="center" sx={{ mt: 2, maxWidth: 600 }}>
              {user.profile.bio}
            </Typography>
          )}
        </Box>

        {/* Posts Grid */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Príspevky
        </Typography>
        <Grid container spacing={3}>
          {user.posts.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" textAlign="center">
                Používateľ zatiaľ nemá žiadne príspevky.
              </Typography>
            </Grid>
          ) : (
            user.posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.imageUrl}
                    alt={post.caption || 'Post image'}
                    sx={{ objectFit: 'cover' }}
                  />
                  {post.caption && (
                    <CardContent>
                      <Typography variant="body2">
                        {post.caption}
                      </Typography>
                    </CardContent>
                  )}
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
} 