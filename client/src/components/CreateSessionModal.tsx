import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";

const createSessionSchema = z.object({
  location: z.string().min(1, "Location is required"),
  title: z.string().min(1, "Title is required"),
  totalSends: z.number().min(0, "Total sends must be 0 or greater"),
  routesClimbed: z.number().min(0, "Routes climbed must be 0 or greater"),
  durationMinutes: z.number().min(1, "Duration must be at least 1 minute"),
});

type CreateSessionData = z.infer<typeof createSessionSchema>;

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSessionModal({ isOpen, onClose }: CreateSessionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateSessionData>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      location: "",
      title: "",
      totalSends: 0,
      routesClimbed: 0,
      durationMinutes: 60,
    },
  });

  const createSessionMutation = useMutation({
    mutationFn: async (data: CreateSessionData) => {
      if (!authManager.isAuthenticated()) {
        throw new Error("You must be logged in to create a session");
      }

      return apiRequest("/api/sessions", {
        method: "POST",
        headers: {
          ...authManager.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Session created!",
        description: "Your climbing session has been logged.",
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create session",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateSessionData) => {
    createSessionMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Climbing Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              placeholder="e.g., Great bouldering session!"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Movement Santa Clara"
              {...form.register("location")}
            />
            {form.formState.errors.location && (
              <p className="text-sm text-red-500">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalSends">Total Sends</Label>
              <Input
                id="totalSends"
                type="number"
                min="0"
                {...form.register("totalSends", { valueAsNumber: true })}
              />
              {form.formState.errors.totalSends && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.totalSends.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="routesClimbed">Routes Climbed</Label>
              <Input
                id="routesClimbed"
                type="number"
                min="0"
                {...form.register("routesClimbed", { valueAsNumber: true })}
              />
              {form.formState.errors.routesClimbed && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.routesClimbed.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (min)</Label>
              <Input
                id="durationMinutes"
                type="number"
                min="1"
                {...form.register("durationMinutes", { valueAsNumber: true })}
              />
              {form.formState.errors.durationMinutes && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.durationMinutes.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createSessionMutation.isPending}
              className="flex-1"
            >
              {createSessionMutation.isPending ? "Creating..." : "Create Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}