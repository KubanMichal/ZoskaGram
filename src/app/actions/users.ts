"use server";

import { prisma } from "@/app/api/auth/[...nextauth]/prisma";

export const searchUsers = async (searchTerm: string) => {
  try {
    const users = await prisma.user.findMany({
      where: searchTerm.trim() ? {
        name: {
          contains: searchTerm,
          mode: 'insensitive', // Case-insensitive search
        },
      } : {},
      include: {
        profile: true, // Include user profile information
      },
      orderBy: {
        name: 'asc', // Order by name alphabetically
      },
      take: 20, // Increased limit for showing all users
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Could not search users");
  }
};

export const getUserIdByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    return user?.id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    throw new Error("Could not fetch user ID");
  }
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Could not fetch user profile");
  }
};

type ProfileUpdateData = {
  name: string;
  bio: string;
  location: string;
};

export const updateUserProfile = async (userId: string, data: ProfileUpdateData) => {
  try {
    // Update user name
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });

    // Update or create profile
    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        bio: data.bio,
        location: data.location,
      },
      update: {
        bio: data.bio,
        location: data.location,
      },
    });

    return { user: updatedUser, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Could not update profile");
  }
}; 