import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, Play, Pause } from "lucide-react";
import { SelectSession, SelectUser, SelectMedia } from "@/../../shared/schema";

interface SessionWithDetails extends SelectSession {
  user: SelectUser;
  media: SelectMedia[];
}

export default function SessionDetails() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);

  const { data: session, isLoading, error } = useQuery<SessionWithDetails>({
    queryKey: [`/api/sessions/${sessionId}`],
    enabled: !!sessionId,
  });

  console.log("SessionDetails Debug:", { sessionId, session, isLoading, error });

  if (error) {
    console.error("Error loading session:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Error loading session</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-white text-black px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Session not found</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 bg-white text-black px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(date));
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (info.offset.y < -100) {
      setIsBottomSheetExpanded(true);
    } else if (info.offset.y > 100) {
      setIsBottomSheetExpanded(false);
    }
  };

  const handleSheetClick = () => {
    if (!isBottomSheetExpanded) {
      setIsBottomSheetExpanded(true);
    }
  };

  const handleMediaTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setDragStartX(e.touches[0].clientX);
  };

  const handleMediaTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (dragStartX === null) return;
    
    const deltaX = e.changedTouches[0].clientX - dragStartX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold && session?.media) {
      if (deltaX > 0 && currentMediaIndex > 0) {
        // Swipe right - previous media
        setCurrentMediaIndex(currentMediaIndex - 1);
      } else if (deltaX < 0 && currentMediaIndex < session.media.length - 1) {
        // Swipe left - next media
        setCurrentMediaIndex(currentMediaIndex + 1);
      }
    }
    
    setDragStartX(null);
  };

  const handleMediaTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
  };

  const goToMedia = (index: number) => {
    setCurrentMediaIndex(index);
  };

  const getRouteColorClass = (color: string | null) => {
    const colorMap: Record<string, string> = {
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      black: "bg-black",
      pink: "bg-pink-500",
    };
    return colorMap[color || ""] || "bg-gray-500";
  };

  const currentMedia = session.media && session.media.length > 0 ? session.media[currentMediaIndex] : null;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden max-w-md mx-auto">
      {/* Media Display */}
      <div 
        className="relative w-full h-screen"
        ref={mediaContainerRef}
        onTouchStart={handleMediaTouchStart}
        onTouchMove={handleMediaTouchMove}
        onTouchEnd={handleMediaTouchEnd}
        style={{ touchAction: 'none' }}
      >
        {currentMedia ? (
          <>
            {currentMedia.type === "photo" ? (
              <img
                src={currentMedia.url}
                alt="Climbing session"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  controls={false}
                  autoPlay={isVideoPlaying}
                  muted
                  loop
                />
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                >
                  {!isVideoPlaying && (
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-xl font-bold mb-2">{session.title}</h2>
              <p>No media for this session</p>
            </div>
          </div>
        )}

        {/* Top overlay with back button and media counter */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-12 pb-4 px-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center gap-2">
              {session.media && session.media.length > 0 && (
                <div className="bg-black bg-opacity-50 rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {currentMediaIndex + 1}/{session.media.length}
                  </span>
                </div>
              )}
              {currentMedia?.routeGrade && (
                <div className={`${getRouteColorClass(currentMedia.routeColor)} rounded-full px-3 py-1`}>
                  <span className="text-white text-sm font-bold">
                    {currentMedia.routeGrade}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media dots indicator */}
        {session.media.length > 1 && (
          <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-white bg-opacity-90 rounded-full px-4 py-2 flex gap-2">
              {session.media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToMedia(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMediaIndex ? 'bg-black' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}


      </div>

      {/* Bottom Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-30 shadow-2xl w-full bottom-sheet"
        initial={{ y: "calc(100% - 150px)" }}
        animate={{ y: isBottomSheetExpanded ? 0 : "calc(100% - 150px)" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: window.innerHeight - 150 }}
        onDragEnd={handlePanEnd}
        onClick={handleSheetClick}
        style={{ 
          height: isBottomSheetExpanded ? "auto" : "150px",
          maxHeight: isBottomSheetExpanded ? "calc(100vh - 32px)" : "150px",
          cursor: isBottomSheetExpanded ? "default" : "pointer" 
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          {/* Session title and info */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {session.title}
            </h1>
            <p className="text-gray-600 text-sm">
              {formatDate(session.createdAt)} • {session.location}
            </p>
          </div>

          {/* Expanded content */}
          {isBottomSheetExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {session.totalSends}
                  </div>
                  <div className="text-sm text-gray-500">Total send</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {session.routesClimbed}
                  </div>
                  <div className="text-sm text-gray-500">Routes climbed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {session.hardestSend || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">Hardest send</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDuration(session.durationMinutes)}
                  </div>
                  <div className="text-sm text-gray-500">Time</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}