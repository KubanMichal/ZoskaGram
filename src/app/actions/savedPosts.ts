"use server";

import { prisma } from "../api/auth/[...nextauth]/prisma";

export const toggleSavePost = async (postId: string, userId: string) => {
  try {
    const existingSave = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingSave) {
      // Unsave
      await prisma.savedPost.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return false; // Indicates post is now unsaved
    } else {
      // Save
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      return true; // Indicates post is now saved
    }
  } catch (error) {
    console.error("Error toggling save:", error);
    throw new Error("Could not toggle save");
  }
};

export const isSavedByUser = async (postId: string, userId: string) => {
  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return !!savedPost;
  } catch (error) {
    console.error("Error checking if post is saved:", error);
    throw new Error("Could not check if post is saved");
  }
};

export const getSavedPosts = async (userId: string) => {
  try {
    const savedPosts = await prisma.savedPost.findMany({
      where: {
        userId,
      },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter out any null posts and map to just the post data
    return savedPosts
      .filter(save => save.post !== null)
      .map(save => ({
        ...save.post,
        user: save.post.user,
        likes: save.post.likes,
        comments: save.post.comments,
      }));
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    throw new Error("Could not fetch saved posts");
  }
}; 