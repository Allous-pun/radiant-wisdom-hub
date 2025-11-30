import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import ClergyDashboard from "./pages/clergy/ClergyDashboard";
import ClergySermonManagement from "./pages/clergy/SermonManagement";
import ClergyPrayerManagement from "./pages/clergy/PrayerManagement";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminSermonManagement from "./pages/admin/SermonManagement";
import AdminPrayerManagement from "./pages/admin/PrayerManagement";
import BookManagement from "./pages/admin/BookManagement";
import AssignmentManagement from "./pages/admin/AssignmentManagement";
import LearningMaterialManagement from "./pages/admin/LearningMaterialManagement";
import ZoomManagement from "./pages/admin/ZoomManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
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

              {/* Student Routes */}
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/materials" element={<LearningMaterials />} />
              <Route path="/student/assignments" element={<Assignments />} />
              <Route path="/student/zoom-schedule" element={<ZoomSchedule />} />

              {/* Clergy Routes */}
              <Route path="/clergy" element={<ClergyDashboard />} />
              <Route path="/clergy/sermons" element={<ClergySermonManagement />} />
              <Route path="/clergy/prayers" element={<ClergyPrayerManagement />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/sermons" element={<AdminSermonManagement />} />
              <Route path="/admin/prayers" element={<AdminPrayerManagement />} />
              <Route path="/admin/books" element={<BookManagement />} />
              <Route path="/admin/assignments" element={<AssignmentManagement />} />
              <Route path="/admin/learning-materials" element={<LearningMaterialManagement />} />
              <Route path="/admin/zoom" element={<ZoomManagement />} />

              {/* 404 Route - MUST BE LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;