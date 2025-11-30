import { useState, useEffect } from "react";
import { Book, FileText, Video, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface StudentStats {
  learningMaterials: number;
  pendingAssignments: number;
  upcomingZoomClasses: number;
  completedAssignments: number;
}

interface ZoomClass {
  id: string;
  title: string;
  date: string;
  time: string;
  meetingLink?: string;
}

interface LearningMaterial {
  id: string;
  title: string;
  type: string;
  uploadedAt: string;
}

const StudentDashboard = () => {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<StudentStats>({
    learningMaterials: 0,
    pendingAssignments: 0,
    upcomingZoomClasses: 0,
    completedAssignments: 0
  });
  const [upcomingClasses, setUpcomingClasses] = useState<ZoomClass[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<LearningMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch student dashboard statistics
  const fetchStudentStats = async () => {
    try {
      // Fetch all learning materials
      const materialsRes = await fetch(`${API_BASE_URL}/materials`);
      
      // Fetch all assignments
      const assignmentsRes = await fetch(`${API_BASE_URL}/assignments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch my submissions to determine pending/completed assignments
      const submissionsRes = await fetch(`${API_BASE_URL}/assignments/submissions/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch zoom meetings
      const zoomRes = await fetch(`${API_BASE_URL}/zoom`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const materialsData = materialsRes.ok ? await materialsRes.json() : { data: [] };
      const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : { data: [] };
      const submissionsData = submissionsRes.ok ? await submissionsRes.json() : { data: [] };
      const zoomData = zoomRes.ok ? await zoomRes.json() : { data: [] };

      // Calculate pending assignments (assignments without submissions or not graded)
      const submittedAssignmentIds = new Set(
        submissionsData.data?.map((sub: any) => sub.assignment?._id || sub.assignment)
      );
      
      const pendingAssignments = assignmentsData.data?.filter((assignment: any) => {
        return !submittedAssignmentIds.has(assignment._id);
      }) || [];

      // Calculate completed assignments (submissions with grades)
      const completedAssignments = submissionsData.data?.filter((sub: any) => 
        sub.grade !== undefined && sub.grade !== null
      ) || [];

      // Get upcoming zoom classes (today and future)
      const now = new Date();
      const upcomingZoomClasses = zoomData.data?.filter((meeting: any) => {
        const meetingDate = new Date(meeting.startTime || meeting.createdAt);
        return meetingDate >= now;
      }) || [];

      // Format upcoming classes
      const formattedClasses: ZoomClass[] = upcomingZoomClasses.slice(0, 2).map((meeting: any) => ({
        id: meeting._id,
        title: meeting.topic || meeting.title || 'Zoom Meeting',
        date: new Date(meeting.startTime || meeting.createdAt).toLocaleDateString(),
        time: new Date(meeting.startTime || meeting.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        meetingLink: meeting.joinUrl || meeting.meetingLink
      }));

      // Format recent materials
      const formattedMaterials: LearningMaterial[] = materialsData.data
        ?.slice(0, 3)
        .map((material: any) => ({
          id: material._id,
          title: material.title,
          type: material.type || 'PDF',
          uploadedAt: new Date(material.createdAt).toLocaleDateString()
        })) || [];

      setStats({
        learningMaterials: materialsData.data?.length || 0,
        pendingAssignments: pendingAssignments.length,
        upcomingZoomClasses: upcomingZoomClasses.length,
        completedAssignments: completedAssignments.length
      });

      setUpcomingClasses(formattedClasses);
      setRecentMaterials(formattedMaterials);

    } catch (error) {
      console.error('Error fetching student stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStudentStats();
    }
  }, [token]);

  const statsConfig = [
    { label: "Learning Materials", value: stats.learningMaterials.toString(), icon: Book, link: "/student/materials" },
    { label: "Pending Assignments", value: stats.pendingAssignments.toString(), icon: FileText, link: "/student/assignments" },
    { label: "Upcoming Zoom Classes", value: stats.upcomingZoomClasses.toString(), icon: Video, link: "/student/zoom-schedule" },
    { label: "Completed Assignments", value: stats.completedAssignments.toString(), icon: Calendar, link: "/student/assignments" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Student Dashboard</h1>
            <p className="text-muted-foreground">Loading dashboard statistics...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat) => (
            <Link key={stat.label} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border/50 bg-card/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Classes */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Upcoming Zoom Classes
              </CardTitle>
              <CardDescription>Your scheduled online sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.length > 0 ? (
                  <>
                    {upcomingClasses.map((cls) => (
                      <div key={cls.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50 border border-border/30">
                        <div>
                          <h3 className="font-semibold text-foreground">{cls.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {cls.date} at {cls.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Link to="/student/zoom-schedule">
                      <Button variant="outline" className="w-full">View All Classes</Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No upcoming classes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Materials */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Recent Learning Materials
              </CardTitle>
              <CardDescription>Recently uploaded resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMaterials.length > 0 ? (
                  <>
                    {recentMaterials.map((material) => (
                      <div key={material.id} className="flex items-start justify-between p-4 rounded-lg bg-muted/50 border border-border/30">
                        <div>
                          <h3 className="font-semibold text-foreground">{material.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {material.type} • {material.uploadedAt}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Link to="/student/materials">
                      <Button variant="outline" className="w-full">View All Materials</Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No learning materials available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;