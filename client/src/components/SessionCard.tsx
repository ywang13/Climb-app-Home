import { TimelineSession } from "@/../../shared/schema";

interface SessionCardProps {
  session: TimelineSession;
  timeAgo: string;
  formattedDuration: string;
}

export default function SessionCard({ session, timeAgo, formattedDuration }: SessionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Header with user info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          {session.user.profilePicture ? (
            <img
              src={session.user.profilePicture}
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
            Movement {session.gym.name.replace("Movement ", "")} • {timeAgo}
          </p>
        </div>
      </div>

      {/* Session content */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 text-base mb-1">{session.title}</h4>
        {session.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{session.description}</p>
        )}
      </div>

      {/* Stats section */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{session.totalSend}</div>
          <div className="text-xs text-gray-500">Total send</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{session.routesClimbed}</div>
          <div className="text-xs text-gray-500">Routes climbed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{formattedDuration}</div>
          <div className="text-xs text-gray-500">Time</div>
        </div>
      </div>
    </div>
  );
}