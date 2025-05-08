import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import ProjectBoard from './pages/ProjectBoard';
import Chat from './pages/Chat';
import SseChat from './pages/SseChat';
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react"
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
              <Analytics/>

    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/project-board" element={<ProjectBoard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/sse-chat" element={<SseChat />} />
          <Route path="/terms-of-service" element={<TermsOfService/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/cookie-policy" element={<CookiePolicy/>}/>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Footer /> */}
      </Router>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
