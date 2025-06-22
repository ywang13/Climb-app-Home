import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
// Timeline session interface to match Python API response
interface TimelineSession {
  id: number;
  title: string;
  description: string | null;
  total_send: number;
  routes_climbed: number;
  duration_minutes: number;
  created_at: string;
  user: {
    id: number;
    username: string;
    profile_picture: string | null;
  };
  gym: {
    id: number;
    name: string;
    location: string;
  };
}

async function fetchTimeline(): Promise<TimelineSession[]> {
  const response = await fetch("/api/timeline");
  if (!response.ok) {
    throw new Error("Failed to fetch timeline");
  }
  return response.json();
}

function formatTimeAgo(date: string): string {
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

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
}

export const Home = (): JSX.Element => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["timeline"],
    queryFn: fetchTimeline,
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
        <div className="flex flex-col w-full items-center gap-2">
          <div className="flex flex-col items-start gap-8 w-full">
            {posts && posts.length > 0 ? posts.map((post) => (
              <Card key={post.id} className="w-full rounded-none shadow-none">
                <CardContent className="flex flex-col items-start gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-[45px] h-[45px]">
                      <AvatarImage
                        src={post.user.profile_picture || "/figmaAssets/intersect-3.png"}
                        alt={`${post.user.username}'s avatar`}
                      />
                      <AvatarFallback>
                        {post.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-start gap-2">
                      <div className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-black text-base">
                        {post.user.username}
                      </div>

                      <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                        {formatTimeAgo(post.created_at)} · Movement {post.gym.name.replace("Movement ", "")}
                      </div>
                    </div>
                  </div>

                  <h2 className="self-stretch [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-2xl">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="self-stretch [font-family:'SF_Pro-Regular',Helvetica] font-normal text-gray-600 text-sm">
                      {post.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                      <span>
                        Total send
                        <br />
                      </span>
                      <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-base">
                        {post.total_send}
                      </span>
                    </div>

                    <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                      <span>
                        Routes climbed
                        <br />
                      </span>
                      <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-base">
                        {post.routes_climbed}
                      </span>
                    </div>

                    <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                      <span>
                        Time
                        <br />
                      </span>
                      <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-base">
                        {formatDuration(post.duration_minutes)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
