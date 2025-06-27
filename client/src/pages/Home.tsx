import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { FeedResponse } from "@/../../shared/schema";
import SessionCard from "@/components/SessionCard";

async function fetchFeed(): Promise<FeedResponse> {
  const response = await fetch("/api/feed");
  if (!response.ok) {
    throw new Error("Failed to fetch feed");
  }
  return response.json();
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

export const Home = (): JSX.Element => {
  const { data: feedData, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: fetchFeed,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
        {/* Fixed Header */}
        <div className="bg-white fixed top-0 left-0 right-0 z-20 border-b border-gray-100">
          <div className="pt-12 pb-4 px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          </div>
        </div>

        {/* Loading Content */}
        <div className="pt-20 pb-28 px-4">
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full bg-white rounded-2xl shadow-none border-0">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-full"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
        {/* Fixed Header */}
        <div className="bg-white fixed top-0 left-0 right-0 z-20 border-b border-gray-100">
          <div className="pt-12 pb-4 px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Home</h1>
          </div>
        </div>
        
        {/* Error Content */}
        <div className="pt-20 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600">Failed to load climbing sessions</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f7' }}>
      {/* Fixed Header */}
      <div className="bg-white fixed top-0 left-0 right-0 z-20 border-b border-gray-100">
        <div className="pt-12 pb-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Home</h1>
        </div>
      </div>

      {/* Scrollable Feed Content */}
      <div className="pt-20 pb-28 px-4">
        {feedData?.sessions && feedData.sessions.length > 0 ? (
          <div className="space-y-4">
            {feedData.sessions.map((session, index) => (
              <div key={session.id} className={index === 0 ? "mt-8" : ""}>
                <SessionCard
                  session={session}
                  timeAgo={formatTimeAgo(session.createdAt)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-600">Check back later for climbing sessions!</p>
          </div>
        )}
      </div>
    </div>
  );
};