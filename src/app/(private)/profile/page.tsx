// src/app/profil/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Container, 
  Box, 
  Typography, 
  Avatar, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Skeleton,
  Paper,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { User, Profile, Post } from '@prisma/client';
import { fetchUserProfile, updateUserProfile, getUserIdByEmail } from '@/app/actions/users';
import { redirect } from 'next/navigation';

type UserWithProfileAndPosts = User & {
  profile: Profile | null;
  posts: Post[];
};

// Extend the Session type to include id


export default function Profile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithProfileAndPosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/prihlasenie');
    }
  }, [status]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?.email) {
        setError('No user session found');
        setLoading(false);
        return;
      }

      try {
        const userId = await getUserIdByEmail(session.user.email);
        
        if (!userId) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const userData = await fetchUserProfile(userId);
        setUser(userData);
        setEditForm({
          name: userData.name || '',
          bio: userData.profile?.bio || '',
          location: userData.profile?.location || ''
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [session, status]);

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      await updateUserProfile(user.id, editForm);
      // Reload user data
      const updatedUser = await fetchUserProfile(user.id);
      setUser(updatedUser);
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sk-SK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
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
            {error || 'Profile not found'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Session Status: {status}
            {session?.user?.email && ` | Email: ${session.user.email}`}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          {/* Profile Header */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 4
          }}>
            {/* Avatar Section */}
            <Box sx={{ position: 'relative' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Zmeniť profilovú fotku">
                    <IconButton
                      sx={{
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={user.image || user.profile?.avatarUrl || undefined}
                  alt={user.name || ''}
                  sx={{ 
                    width: 150, 
                    height: 150,
                    boxShadow: 3
                  }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              </Badge>
            </Box>

            {/* Profile Info Section */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h4">
                  {user.name}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{ borderRadius: 2 }}
                >
                  Upraviť Profil
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {user.profile?.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="action" />
                    <Typography>{user.profile.location}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon color="action" />
                  <Typography>{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon color="action" />
                  <Typography>Členom od {formatDate(user.createdAt)}</Typography>
                </Box>
              </Box>

              {user.profile?.bio && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mt: 2,
                    p: 2,
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }}
                >
                  {user.profile.bio}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Stats Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">{user.posts.length}</Typography>
                <Typography color="text.secondary">Príspevkov</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">0</Typography>
                <Typography color="text.secondary">Sledovateľov</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4">0</Typography>
                <Typography color="text.secondary">Sledovaní</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Posts Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Moje príspevky
          </Typography>
          <Grid container spacing={3}>
            {user.posts.length === 0 ? (
              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    py: 4,
                    bgcolor: 'action.hover',
                    borderRadius: 2
                  }}
                >
                  <Typography color="text.secondary">
                    Zatiaľ nemáte žiadne príspevky.
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    href="/prispevok"
                  >
                    Pridať prvý príspevok
                  </Button>
                </Box>
              </Grid>
            ) : (
              user.posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.imageUrl}
                      alt={post.caption || 'Post image'}
                      sx={{ objectFit: 'cover' }}
                    />
                    {post.caption && (
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">
                          {post.caption}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {formatDate(post.createdAt)}
                        </Typography>
                      </CardContent>
                    )}
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Paper>

        {/* Edit Profile Dialog */}
        <Dialog 
          open={openEditDialog} 
          onClose={handleCloseDialog} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle>Upraviť Profil</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Meno"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Lokalita"
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                variant="outlined"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Zrušiť
            </Button>
            <Button 
              onClick={handleSaveProfile} 
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Uložiť
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
