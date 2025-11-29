import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Add this import
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Sermons from "./pages/Sermons";
import SermonDetail from "./pages/SermonDetail";
import Prayers from "./pages/Prayers";
import PrayerDetail from "./pages/PrayerDetail";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import StudentDashboard from "./pages/student/StudentDashboard";
import LearningMaterials from "./pages/student/LearningMaterials";
import Assignments from "./pages/student/Assignments";
import ZoomSchedule from "./pages/student/ZoomSchedule";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider> {/* Wrap with AuthProvider */}
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/sermons/:id" element={<SermonDetail />} />
              <Route path="/prayers" element={<Prayers />} />
              <Route path="/prayers/:id" element={<PrayerDetail />} />
              <Route path="/books" element={<Books />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/materials" element={<LearningMaterials />} />
              <Route path="/student/assignments" element={<Assignments />} />
              <Route path="/student/zoom-schedule" element={<ZoomSchedule />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;