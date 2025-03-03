// src/app/hladanie/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { searchUsers } from '@/app/actions/users';
import Link from 'next/link';
import { User, Profile } from '@prisma/client';

type UserWithProfile = User & {
  profile: Profile | null;
};

//export const metadata = { title: "Hladanie | ZoškaSnap"}

export default function Find() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load all users when component mounts
  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    setIsSearching(true);
    try {
      const results = await searchUsers(value);
      setUsers(results);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const getAvatarSrc = (user: UserWithProfile): string | undefined => {
    if (user.image) return user.image;
    if (user.profile?.avatarUrl) return user.profile.avatarUrl;
    return undefined;
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hľadanie používateľov
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Zadajte meno používateľa..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />

        {isSearching && (
          <Typography>Vyhľadávam...</Typography>
        )}

        {!isSearching && users.length > 0 && (
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                component={Link}
                href={`/profil/${user.id}`}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={getAvatarSrc(user)} alt={user.name || ''}>
                    {user.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.profile?.location || 'Bez lokácie'}
                />
              </ListItem>
            ))}
          </List>
        )}

        {!isSearching && users.length === 0 && (
          <Typography color="text.secondary">
            Neboli nájdení žiadni používatelia.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
