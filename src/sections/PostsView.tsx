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

// Server action import
import { fetchPosts } from "@/app/actions/posts";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";

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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LikeButton postId={post.id} initialLikeCount={post.likes.length} />
              <CommentButton postId={post.id} initialCommentCount={post.comments.length} />
            </Box>
          </CardActions>
        </Card>
      ))}
    </Container>
  );
};

export default PostsView;