import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Home = (): JSX.Element => {
  // Data for user posts
  const posts = [
    {
      id: 1,
      username: "user1",
      location: "Movement Santa Clara",
      title: "Morning session",
      stats: {
        totalSend: "11",
        routesClimbed: "12",
        time: "1h 56m",
      },
    },
    {
      id: 2,
      username: "user2",
      location: "Movement Sunnyvale",
      title: "the v2 in my gym is lit 🔥",
      stats: {
        totalSend: "15",
        routesClimbed: "15",
        time: "2h 3m",
      },
    },
    {
      id: 3,
      username: "user3",
      location: "Movement Sunnyvale",
      title: "Afternoon session",
      stats: {
        totalSend: "15",
        routesClimbed: "15",
        time: "2h 3m",
      },
    },
    {
      id: 4,
      username: "user4",
      location: "Movement Sunnyvale",
      title: "Evening session",
      stats: {
        totalSend: "15",
        routesClimbed: "15",
        time: "2h 3m",
      },
    },
  ];

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
            {posts.map((post) => (
              <Card key={post.id} className="w-full rounded-none shadow-none">
                <CardContent className="flex flex-col items-start gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-[45px] h-[45px]">
                      <AvatarImage
                        src="/figmaAssets/intersect-3.png"
                        alt={`${post.username}'s avatar`}
                      />
                      <AvatarFallback>
                        {post.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-start gap-2">
                      <div className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-black text-base">
                        {post.username}
                      </div>

                      <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                        Today · {post.location}
                      </div>
                    </div>
                  </div>

                  <h2 className="self-stretch [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-black text-2xl">
                    {post.title}
                  </h2>

                  <div className="flex items-center gap-4">
                    <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                      <span>
                        Total send
                        <br />
                      </span>
                      <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-base">
                        {post.stats.totalSend}
                      </span>
                    </div>

                    <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                      <span>
                        Routes climbed
                        <br />
                      </span>
                      <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-base">
                        {post.stats.routesClimbed}
                      </span>
                    </div>

                    <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-xs">
                      <span>
                        Time
                        <br />
                      </span>
                      <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-base">
                        {post.stats.time}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
