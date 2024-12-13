// src/app/private/[id]/page.tsx

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Example of a function to fetch resource details based on ID (modify based on your use case)
const fetchResourceDetails = async (id: string) => {
  // You can modify this function to fetch data for your specific use case
  // For example, if it's a user profile, fetch user data, or if it's a post, fetch post details
  const response = await fetch(`/api/private/resource/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch resource data');
  }
  const data = await response.json();
  return data;
};

const PrivateIdPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const [resource, setResource] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (status === "loading") return; // Wait until the session status is resolved

    if (!session) {
      // Redirect to the registration page if the user is not logged in
      router.push("/auth/registracia");
    } else {
      // Fetch the resource (e.g., user profile or post) based on the ID
      fetchResourceDetails(id)
        .then(setResource)
        .catch((error) => {
          console.error(error);
          router.push("/404"); // Optionally, you can handle errors by redirecting to a custom 404 page
        });
    }
  }, [session, status, id, router]);

  if (status === "loading" || !resource) {
    // Show a loading spinner or skeleton while data is being fetched
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Resource Details (ID: {id})</h1>
      {/* Render the resource details, based on what you fetched */}
      <pre>{JSON.stringify(resource, null, 2)}</pre>
      {/* Customize this based on your actual resource structure */}
    </div>
  );
};

export default PrivateIdPage;
