'use client';

import { useState, useEffect } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { toggleSavePost, isSavedByUser } from '@/app/actions/savedPosts';
import { getUserIdByEmail } from '@/app/actions/users';
import { useSession } from 'next-auth/react';

interface SaveButtonProps {
  postId: string;
}

export default function SaveButton({ postId }: SaveButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSaveStatus = async () => {
      if (!session?.user?.email) return;
      
      try {
        const userId = await getUserIdByEmail(session.user.email);
        if (!userId) return;
        
        const saved = await isSavedByUser(postId, userId);
        setIsSaved(saved);
      } catch (error) {
        console.error('Error checking save status:', error);
      }
    };

    checkSaveStatus();
  }, [session, postId]);

  const handleToggleSave = async () => {
    if (!session?.user?.email || isLoading) return;

    setIsLoading(true);
    try {
      const userId = await getUserIdByEmail(session.user.email);
      if (!userId) return;

      const newSaveStatus = await toggleSavePost(postId, userId);
      setIsSaved(newSaveStatus);
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <Tooltip title={isSaved ? "Odstrániť z uložených" : "Uložiť príspevok"}>
      <IconButton 
        onClick={handleToggleSave}
        disabled={isLoading}
      >
        {isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </Tooltip>
  );
} 