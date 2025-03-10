'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconButton, Typography, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, List, ListItem, ListItemAvatar, ListItemText, Avatar, Alert, Menu, MenuItem, ListItemIcon } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { createComment, getComments, getCommentCount, deleteComment } from '@/app/actions/comments';
import { getUserIdByEmail } from '@/app/actions/users';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import { sk } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentButtonProps {
  postId: string;
  initialCommentCount?: number;
}

export default function CommentButton({ postId, initialCommentCount = 0 }: CommentButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setError(null);
      const [fetchedComments, count] = await Promise.all([
        getComments(postId),
        getCommentCount(postId),
      ]);
      setComments(fetchedComments);
      setCommentCount(count);
    } catch (error) {
      console.error('Error loading comments:', error);
      setError('Nepodarilo sa načítať komentáre');
    }
  }, [postId]);

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen, loadComments]);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setNewComment('');
    setError(null);
  };

  const handleSubmit = async () => {
    if (!session?.user?.email || !newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const userId = await getUserIdByEmail(session.user.email);
      if (!userId) {
        setError('Nepodarilo sa overiť používateľa');
        return;
      }

      await createComment(postId, userId, newComment.trim());
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Nepodarilo sa pridať komentár');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, commentId: string) => {
    event.stopPropagation();
    setSelectedCommentId(commentId);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedCommentId(null);
  };

  const handleDeleteComment = async () => {
    if (!session?.user?.email || !selectedCommentId) return;

    try {
      const userId = await getUserIdByEmail(session.user.email);
      if (!userId) {
        setError('Nepodarilo sa overiť používateľa');
        return;
      }

      await deleteComment(selectedCommentId, userId);
      await loadComments();
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Nepodarilo sa vymazať komentár');
    }
  };

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: sk });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'neznámy čas';
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleClick}>
          <CommentIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {commentCount}
        </Typography>
      </Box>

      <Dialog 
        open={isOpen} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Komentáre</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <List sx={{ mb: 2 }}>
            {comments.map((comment) => (
              <ListItem 
                key={comment.id} 
                alignItems="flex-start"
                secondaryAction={
                  session?.user?.email && comment.user.id === comments.find(c => c.id === comment.id)?.user.id && (
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, comment.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={comment.user.image || undefined} alt={comment.user.name || ''}>
                    {comment.user.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.user.name || 'Neznámy používateľ'}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {comment.content}
                      </Typography>
                      <br />
                      <Typography component="span" variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
            {!error && comments.length === 0 && (
              <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Zatiaľ žiadne komentáre
              </Typography>
            )}
          </List>
          {session ? (
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Napíšte komentár..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              error={!!error && error.includes('pridať')}
              helperText={error && error.includes('pridať') ? error : undefined}
            />
          ) : (
            <Typography color="text.secondary" textAlign="center">
              Pre pridanie komentára sa musíte prihlásiť
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Zavrieť</Button>
          {session && (
            <Button 
              onClick={handleSubmit} 
              disabled={!newComment.trim() || isSubmitting}
              variant="contained"
            >
              {isSubmitting ? 'Pridávam...' : 'Pridať komentár'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteComment} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Vymazať komentár</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
} 