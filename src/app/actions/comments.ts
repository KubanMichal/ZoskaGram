"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

export const createComment = async (postId: string, userId: string, content: string) => {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
      include: {
        user: true, // Include user info with the comment
      },
    });
    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Could not create comment");
  }
};

export const getComments = async (postId: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            id: true, // Include user ID to check ownership
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Could not fetch comments");
  }
};

export const getCommentCount = async (postId: string) => {
  try {
    const count = await prisma.comment.count({
      where: {
        postId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting comment count:", error);
    throw new Error("Could not get comment count");
  }
};

export const deleteComment = async (commentId: string, userId: string) => {
  try {
    // First check if the comment belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Could not delete comment");
  }
}; 