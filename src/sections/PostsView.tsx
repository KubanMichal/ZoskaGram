//
"use client";

// React imports
import { useEffect, useState } from "react";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

// Server action import
import { fetchPosts } from "@/app/actions/posts";
import { addComment } from "@/app/actions/comments";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";
import SaveButton from '@/components/SaveButton';

// Post interface
interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
  };
  likes: {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;
  }[];
  comments: {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const PostsView = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [submittingComment, setSubmittingComment] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts: Post[] = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    loadPosts();
  }, []);

  const handleCommentSubmit = async (postId: string) => {
    if (!newComments[postId]?.trim()) return;

    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await addComment(postId, newComments[postId]);
      setNewComments(prev => ({ ...prev, [postId]: '' }));
      
      // Refresh posts to show new comment
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <Container sx={{py:4}} maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3 }} textAlign={"center"}>
        Príspevky
      </Typography>
      {posts.map((post) => (
        <Card key={post.id} sx={{m:4}}>
          <CardMedia
            component="img"
            image={post.imageUrl}
            alt={post.caption || "Príspevok bez popisu"}
          />
          <CardContent>
            <Typography variant="body1">{post.caption || "Bez popisu"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {post.user.name || "Neznámy používateľ"}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions>
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <LikeButton postId={post.id} initialLikeCount={post.likes.length} initialIsLiked={false} />
              <CommentButton postId={post.id} initialCommentCount={post.comments.length} />
              <Box sx={{ flexGrow: 1 }} />
              <SaveButton postId={post.id} />
            </Box>
          </CardActions>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Pridať komentár..."
                value={newComments[post.id] || ''}
                onChange={(e) => setNewComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit(post.id);
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <IconButton
                color="primary"
                disabled={submittingComment[post.id] || !newComments[post.id]?.trim()}
                onClick={() => handleCommentSubmit(post.id)}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      ))}
    </Container>
  );
};

export default PostsView;