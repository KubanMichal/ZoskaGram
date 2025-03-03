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