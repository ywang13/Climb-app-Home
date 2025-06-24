import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authManager } from "@/lib/auth";
import { AuthModal } from "./auth/AuthModal";

export function UserMenu() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => authManager.getCurrentUser(),
    enabled: authManager.isAuthenticated(),
    retry: false,
  });

  const handleLogout = () => {
    authManager.logout();
    window.location.reload(); // Simple way to reset app state
  };

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  if (!authManager.isAuthenticated()) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openAuthModal("login")}
          >
            Sign In
          </Button>
          <Button
            size="sm"
            onClick={() => openAuthModal("register")}
          >
            Sign Up
          </Button>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode={authMode}
        />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => openAuthModal("login")}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled>
          <div className="flex flex-col">
            <span className="font-medium">{user.username}</span>
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}