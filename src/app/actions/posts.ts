// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/app/api/auth/[...nextauth]/prisma";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

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
export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const image = formData.get('image') as File;
  const caption = formData.get('caption') as string;

  if (!image) {
    throw new Error('No image provided');
  }

  try {
    // Upload image to Vercel Blob
    const blob = await put(image.name, image, {
      access: 'public',
    });

    // Create post in database
    const post = await prisma.post.create({
      data: {
        imageUrl: blob.url,
        caption,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    revalidatePath('/prispevok');
    return post;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }
}