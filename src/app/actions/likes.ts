"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";


export const toggleLike = async (postId: string, userId: string) => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return false; // Indicates post is now unliked
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return true; // Indicates post is now liked
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Could not toggle like");
  }
};

export const getLikeCount = async (postId: string) => {
  try {
    const count = await prisma.like.count({
      where: {
        postId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting like count:", error);
    throw new Error("Could not get like count");
  }
};

export const isLikedByUser = async (postId: string, userId: string) => {
  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });
    return !!like;
  } catch (error) {
    console.error("Error checking if post is liked:", error);
    throw new Error("Could not check if post is liked");
  }
}; 