'use client';

import { useState, useEffect } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toggleLike, getLikeCount, isLikedByUser } from '@/app/actions/likes';
import { getUserIdByEmail } from '@/app/actions/users';
import { useSession } from 'next-auth/react';

interface LikeButtonProps {
  postId: string;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
}

export default function LikeButton({ postId, initialLikeCount = 0, initialIsLiked = false }: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLikeStatus = async () => {
      if (!session?.user?.email) return;

      try {
        const userId = await getUserIdByEmail(session.user.email);
        if (!userId) return;

        const [liked, count] = await Promise.all([
          isLikedByUser(postId, userId),
          getLikeCount(postId),
        ]);

        setIsLiked(liked);
        setLikeCount(count);
      } catch (error) {
        console.error('Error loading like status:', error);
      }
    };

    loadLikeStatus();
  }, [postId, session?.user?.email]);

  const handleLikeClick = async () => {
    if (!session?.user?.email || isLoading) return;

    setIsLoading(true);
    try {
      const userId = await getUserIdByEmail(session.user.email);
      if (!userId) return;

      const isNowLiked = await toggleLike(postId, userId);
      setIsLiked(isNowLiked);
      setLikeCount(prev => isNowLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton 
        onClick={handleLikeClick}
        disabled={isLoading || !session}
        sx={{ 
          color: isLiked ? 'error.main' : 'inherit',
          '&:hover': {
            color: isLiked ? 'error.dark' : 'error.light',
          },
        }}
      >
        {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2" color="text.secondary">
        {likeCount}
      </Typography>
    </Box>
  );
} 