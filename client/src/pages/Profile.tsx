import React from "react";
import { useQuery } from "@tanstack/react-query";
import { SelectUser, FeedSession } from "@/../../shared/schema";
import SessionCard from "@/components/SessionCard";

interface UserProfileResponse {
  sessions: FeedSession[];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 24) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
}

export default function Profile() {
  // TODO: Re-enable authentication after testing
  // Temporarily bypass authentication and show Toad1's profile (user ID 1)
  
  // Hardcoded user data for Toad1
  const currentUser: SelectUser = {
    id: 1,
    username: "Toad1",
    email: "toad1@example.com",
    hashedPassword: "",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    height: 178,
    reach: 2, // +2cm
    bio: "Documenting my ascent and falling. (Sorry, climbing has become my entire personality)",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Get user's sessions (still use API but for user ID 1)
  const { data: userSessions, isLoading: sessionsLoading } = useQuery<UserProfileResponse>({
    queryKey: [`/api/users/1/sessions`],
  });

  if (false) { // userLoading disabled for testing
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-gray-600">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header Section */}
      <div className="bg-white">
        <div className="pt-12 pb-6 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">You</h1>
          
          {/* User Avatar */}
          <div className="mb-4">
            <img
              src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
              alt={currentUser.username}
              className="w-24 h-24 rounded-full mx-auto object-cover"
            />
          </div>
          
          {/* Username */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentUser.username}
          </h2>
          
          {/* Height and Reach */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Height</div>
              <div className="font-medium text-gray-900">
                {currentUser.height ? `${currentUser.height}cm` : "--"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Reach</div>
              <div className="font-medium text-gray-900">
                {currentUser.reach !== null 
                  ? `${currentUser.reach >= 0 ? '+' : ''}${currentUser.reach}cm`
                  : "--"
                }
              </div>
            </div>
          </div>
          
          {/* Bio */}
          {currentUser.bio && (
            <p className="text-gray-700 text-sm max-w-sm mx-auto leading-relaxed">
              {currentUser.bio}
            </p>
          )}
        </div>
      </div>
      
      {/* Sessions Feed */}
      <div className="px-4 mt-6">
        {sessionsLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading sessions...</div>
          </div>
        ) : userSessions?.sessions.length ? (
          <div className="space-y-4">
            {userSessions.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                timeAgo={formatTimeAgo(session.createdAt)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No climbing sessions yet</div>
            <div className="text-sm text-gray-400 mt-1">
              Start logging your climbs to see them here!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}