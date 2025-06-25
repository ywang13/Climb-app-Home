import { useNavigate } from "react-router-dom";
import { FeedSession } from "@/../../shared/schema";
import MediaGallery from "./MediaGallery";

interface SessionCardProps {
  session: FeedSession;
  timeAgo: string;
}

export default function SessionCard({ session, timeAgo }: SessionCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/session/${session.id}`);
  };

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      {/* Header with user info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          {session.user.avatarUrl ? (
            <img
              src={session.user.avatarUrl}
              alt={session.user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {session.user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">{session.user.username}</h3>
          <p className="text-gray-500 text-xs">
            {timeAgo} • {session.location}
          </p>
        </div>
      </div>

      {/* Session content */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 text-base mb-3">{session.title}</h4>
        
        {/* Stats section */}
        <div className="flex items-start gap-8 mb-4">
          <div>
            <div className="text-xs text-gray-500">Total send</div>
            <div className="text-lg font-bold text-gray-900">{session.stats.totalSends}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Routes climbed</div>
            <div className="text-lg font-bold text-gray-900">{session.stats.routesClimbed}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Time</div>
            <div className="text-lg font-bold text-gray-900">{session.stats.duration}</div>
          </div>
        </div>
        
        {/* Media Gallery */}
        {session.media && session.media.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <MediaGallery media={session.media} />
          </div>
        )}
      </div>
    </div>
  );
}