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
      <main className="relative w-full max-w-[440px] h-[956px] bg-[#f7f7f7] mx-auto">
        {/* Status Bar */}
        <div className="flex flex-col w-full h-[50px] items-start pt-[21px] pb-0 px-0 absolute top-0 left-0 bg-white">
          <div className="flex items-center justify-between relative self-stretch w-full">
            <div className="flex items-center justify-center gap-2.5 pl-4 pr-1.5 py-0 relative flex-1 grow">
              <div className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-[17px] text-center tracking-[0] leading-[22px] whitespace-nowrap">
                9:41
              </div>
            </div>
            <div className="relative w-[124px] h-2.5" />
            <div className="flex items-center justify-center gap-[7px] pl-1.5 pr-4 py-0 relative flex-1 grow">
              <div className="w-[19.2px] h-[12.23px] bg-gray-300 rounded"></div>
              <div className="w-[17.14px] h-[12.33px] bg-gray-300 rounded"></div>
              <div className="relative w-[27.33px] h-[13px]">
                <div className="w-[25px] h-[13px] top-0 rounded-[4.3px] border border-solid border-[#00000059] absolute left-0">
                  <div className="relative w-[21px] h-[9px] top-px left-px bg-black rounded-[2.5px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="absolute w-full max-w-[440px] h-[68px] top-[50px] left-0 bg-white shadow-[0px_4px_5px_#0000001a] flex items-center justify-center">
          <h1 className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
            Home
          </h1>
        </header>

        {/* Loading Content */}
        <div className="w-full max-w-[440px] h-[806px] top-[150px] absolute left-0">
          <div className="flex flex-col w-full items-center gap-2">
            <div className="flex flex-col items-start gap-8 w-full">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="w-full rounded-none shadow-none animate-pulse">
                  <CardContent className="flex flex-col items-start gap-4 p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-[45px] h-[45px] bg-gray-200 rounded-full"></div>
                      <div className="flex flex-col items-start gap-2">
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
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative w-full max-w-[440px] h-[956px] bg-[#f7f7f7] mx-auto flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load climbing sessions</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full max-w-[440px] h-[956px] bg-[#f7f7f7] mx-auto">
      {/* Status Bar */}
      <div className="flex flex-col w-full h-[50px] items-start pt-[21px] pb-0 px-0 absolute top-0 left-0 bg-white">
        <div className="flex items-center justify-between relative self-stretch w-full">
          <div className="flex items-center justify-center gap-2.5 pl-4 pr-1.5 py-0 relative flex-1 grow">
            <div className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-[17px] text-center tracking-[0] leading-[22px] whitespace-nowrap">
              9:41
            </div>
          </div>

          <div className="relative w-[124px] h-2.5" />

          <div className="flex items-center justify-center gap-[7px] pl-1.5 pr-4 py-0 relative flex-1 grow">
            <img
              className="relative w-[19.2px] h-[12.23px]"
              alt="Cellular connection"
              src="/figmaAssets/cellular-connection.svg"
            />

            <img
              className="relative w-[17.14px] h-[12.33px]"
              alt="Wifi"
              src="/figmaAssets/wifi.svg"
            />

            <div className="relative w-[27.33px] h-[13px]">
              <div className="w-[25px] h-[13px] top-0 rounded-[4.3px] border border-solid border-[#00000059] absolute left-0">
                <div className="relative w-[21px] h-[9px] top-px left-px bg-black rounded-[2.5px]" />
              </div>

              <img
                className="absolute w-px h-1 top-[5px] left-[26px]"
                alt="Cap"
                src="/figmaAssets/cap.svg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="absolute w-full max-w-[440px] h-[68px] top-[50px] left-0 bg-white shadow-[0px_4px_5px_#0000001a] flex items-center justify-center">
        <h1 className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-black text-base tracking-[0] leading-[normal]">
          Home
        </h1>
      </header>

      {/* Content */}
      <div className="w-full max-w-[440px] h-[806px] top-[150px] absolute left-0">
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="space-y-4 max-w-md mx-auto">
            {feedData?.sessions && feedData.sessions.length > 0 ? feedData.sessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                timeAgo={formatTimeAgo(session.createdAt)}
              />
            )) : (
              <div className="w-full text-center py-12">
                <p className="text-gray-600 text-lg">No climbing sessions yet</p>
                <p className="text-gray-500 text-sm mt-2">Start logging your climbs to see them here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute w-full max-w-[440px] h-[34px] bottom-0 left-0 bg-white flex items-center justify-center">
          <Separator className="w-36 h-[5px] bg-black rounded-[100px]" />
        </div>
      </div>
    </main>
  );
};
