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
 
// Server action import
import { fetchPosts } from "@/app/actions/posts";
 
// Post interface
interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption?: string | null;
  createdAt: Date; // Adjusted to match fetched data type
  updatedAt: Date; // Adjusted to match fetched data type
  user: {
    name: string | null;
  };
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
            </Card>
        ))}
    </Container>
  );
};
 
export default PostsView;