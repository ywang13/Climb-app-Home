import React from "react";
import type { SessionMedia } from "@/../../shared/schema";

interface MediaGalleryProps {
  media: SessionMedia[];
}

function formatVideoDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `0:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  if (!media || media.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {media.map((item) => (
          <div
            key={item.id}
            className="relative flex-shrink-0 w-[150px] h-[200px] rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={item.type === "video" ? item.thumbnailUrl || item.url : item.url}
              alt={item.type === "video" ? "Video thumbnail" : "Photo"}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {item.type === "video" && item.duration && (
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                {formatVideoDuration(item.duration)}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}