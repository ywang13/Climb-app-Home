import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/BottomNavigation";

import { Home } from "@/pages/Home";
import SessionDetails from "@/pages/SessionDetails";
import Profile from "@/pages/Profile";

function Router() {
  const [location] = useLocation();
  
  // Show bottom navigation only on Home and Profile pages
  const showBottomNav = location === "/" || location === "/profile";
  
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/session/:sessionId" component={SessionDetails} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      {showBottomNav && <BottomNavigation />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
