import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Heart, Book, FileText, Calendar, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalUsers: number;
  totalSermons: number;
  totalPrayers: number;
  totalBooks: number;
  totalAssignments: number;
  totalLearningMaterials: number;
  totalZoomMeetings: number;
  recentActivity: Array<{
    action: string;
    user: string;
    time: string;
  }>;
}

const AdminDashboard = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSermons: 0,
    totalPrayers: 0,
    totalBooks: 0,
    totalAssignments: 0,
    totalLearningMaterials: 0,
    totalZoomMeetings: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      // Fetch all statistics in parallel
      const [
        usersRes,
        sermonsRes,
        prayersRes,
        booksRes,
        assignmentsRes,
        materialsRes,
        zoomRes
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/sermons`),
        fetch(`${API_BASE_URL}/prayers`),
        fetch(`${API_BASE_URL}/books`),
        fetch(`${API_BASE_URL}/assignments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/materials`),
        fetch(`${API_BASE_URL}/zoom`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const usersData = usersRes.ok ? await usersRes.json() : { data: [] };
      const sermonsData = sermonsRes.ok ? await sermonsRes.json() : { data: [] };
      const prayersData = prayersRes.ok ? await prayersRes.json() : { data: [] };
      const booksData = booksRes.ok ? await booksRes.json() : { data: [] };
      const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : { data: [] };
      const materialsData = materialsRes.ok ? await materialsRes.json() : { data: [] };
      const zoomData = zoomRes.ok ? await zoomRes.json() : { data: [] };

      setStats({
        totalUsers: usersData.data?.length || 0,
        totalSermons: sermonsData.data?.length || 0,
        totalPrayers: prayersData.data?.length || 0,
        totalBooks: booksData.data?.length || 0,
        totalAssignments: assignmentsData.data?.length || 0,
        totalLearningMaterials: materialsData.data?.length || 0,
        totalZoomMeetings: zoomData.data?.length || 0,
        recentActivity: generateRecentActivity([
          ...(sermonsData.data || []),
          ...(prayersData.data || []),
          ...(booksData.data || []),
          ...(assignmentsData.data || []),
          ...(materialsData.data || []),
          ...(zoomData.data || [])
        ])
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate recent activity from the latest items
  const generateRecentActivity = (items: any[]) => {
    const recentItems = items
      .sort((a, b) => new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime())
      .slice(0, 5);

    return recentItems.map(item => {
      let action = '';
      let user = 'System';
      let time = '';

      if (item.createdAt) {
        time = formatTimeAgo(new Date(item.createdAt));
      }

      // Determine action and user based on item type
      if (item.title && item.createdBy?.name) {
        // Sermon, Book, Material, Assignment, Zoom
        if (item.audio) action = `Sermon published: ${item.title}`;
        else if (item.pdfFile) action = `Book uploaded: ${item.title}`;
        else if (item.type) action = `Learning material added: ${item.title}`;
        else if (item.dueDate) action = `Assignment created: ${item.title}`;
        else if (item.meetingLink) action = `Zoom meeting scheduled: ${item.title}`;
        else action = `Item created: ${item.title}`;
        
        user = item.createdBy.name;
      } else if (item.content && item.author?.name) {
        // Prayer
        action = `Prayer added: ${item.content.substring(0, 50)}...`;
        user = item.author.name;
      }

      return { action, user, time };
    }).filter(activity => activity.action && activity.time);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const statsConfig = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: "Registered users",
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Sermons",
      value: stats.totalSermons.toString(),
      description: "Audio sermons available",
      icon: BookOpen,
      link: "/admin/sermons",
    },
    {
      title: "Prayers",
      value: stats.totalPrayers.toString(),
      description: "Prayer requests",
      icon: Heart,
      link: "/admin/prayers",
    },
    {
      title: "Books",
      value: stats.totalBooks.toString(),
      description: "PDF books available",
      icon: Book,
      link: "/admin/books",
    },
    {
      title: "Assignments",
      value: stats.totalAssignments.toString(),
      description: "Active assignments",
      icon: FileText,
      link: "/admin/assignments",
    },
    {
      title: "Learning Materials",
      value: stats.totalLearningMaterials.toString(),
      description: "Educational resources",
      icon: Calendar,
      link: "/admin/learning-materials",
    },
    {
      title: "Zoom Meetings",
      value: stats.totalZoomMeetings.toString(),
      description: "Scheduled classes",
      icon: Video,
      link: "/admin/zoom",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Loading dashboard statistics...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 w-4 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                  <div className="h-9 bg-muted rounded mt-3"></div>
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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all aspects of Teacher of Excellence platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsConfig.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-3">{stat.description}</p>
                <Link to={stat.link}>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used admin functions</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/users">
                <Button className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Manage Users</span>
                </Button>
              </Link>
              <Link to="/admin/sermons">
                <Button variant="secondary" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-sm">Manage Sermons</span>
                </Button>
              </Link>
              <Link to="/admin/zoom">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <Video className="h-5 w-5" />
                  <span className="text-sm">Manage Zoom</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
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

export default AdminDashboard;