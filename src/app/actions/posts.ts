// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import type { Prisma } from "@prisma/client";

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    user: true;
    likes: true;
    comments: true;
  };
}>;

// Fetch all posts
export const fetchPosts = async (): Promise<PostWithRelations[]> => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Could not fetch posts");
  }
};

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string): Promise<PostWithRelations[]> => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post
export const createPost = async (userId: string, imageUrl: string, caption?: string): Promise<PostWithRelations> => {
  try {
    const newPost = await prisma.post.create({
      data: {
        userId,
        imageUrl,
        caption,
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Could not create post");
  }
};