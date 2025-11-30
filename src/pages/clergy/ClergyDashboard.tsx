import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ClergyStats {
  mySermons: number;
  myPrayers: number;
  churchMembers: number;
  upcomingServices: number;
}

interface RecentActivity {
  action: string;
  title: string;
  time: string;
}

const ClergyDashboard = () => {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ClergyStats>({
    mySermons: 0,
    myPrayers: 0,
    churchMembers: 0,
    upcomingServices: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch clergy dashboard statistics
  const fetchClergyStats = async () => {
    try {
      // Fetch sermons by current clergy
      const sermonsRes = await fetch(`${API_BASE_URL}/sermons/author/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch prayers by current clergy
      const prayersRes = await fetch(`${API_BASE_URL}/prayers/author/${user?.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Fetch all users (for church members count)
      const usersRes = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const sermonsData = sermonsRes.ok ? await sermonsRes.json() : { data: [] };
      const prayersData = prayersRes.ok ? await prayersRes.json() : { data: [] };
      const usersData = usersRes.ok ? await usersRes.json() : { data: [] };

      // Calculate upcoming services (this week's sermons)
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingSermons = sermonsData.data?.filter((sermon: any) => {
        const sermonDate = new Date(sermon.createdAt);
        return sermonDate > now && sermonDate <= oneWeekFromNow;
      }) || [];

      setStats({
        mySermons: sermonsData.data?.length || 0,
        myPrayers: prayersData.data?.length || 0,
        churchMembers: usersData.data?.length || 0,
        upcomingServices: upcomingSermons.length
      });

      // Generate recent activity from sermons and prayers
      const allActivities = [
        ...(sermonsData.data || []).map((sermon: any) => ({
          action: "Published sermon",
          title: sermon.title,
          time: formatTimeAgo(new Date(sermon.createdAt))
        })),
        ...(prayersData.data || []).map((prayer: any) => ({
          action: "Added prayer",
          title: prayer.content?.substring(0, 30) + '...' || "Prayer request",
          time: formatTimeAgo(new Date(prayer.createdAt))
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
       .slice(0, 5);

      setRecentActivity(allActivities);

    } catch (error) {
      console.error('Error fetching clergy stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    if (token && user?.id) {
      fetchClergyStats();
    }
  }, [token, user]);

  const statsConfig = [
    {
      title: "My Sermons",
      value: stats.mySermons.toString(),
      description: "Published sermons",
      icon: BookOpen,
      link: "/clergy/sermons",
    },
    {
      title: "My Prayers",
      value: stats.myPrayers.toString(),
      description: "Shared prayers",
      icon: Heart,
      link: "/clergy/prayers",
    },
    {
      title: "Church Members",
      value: stats.churchMembers.toString(),
      description: "Active members",
      icon: Users,
      link: "#",
    },
    {
      title: "Upcoming Services",
      value: stats.upcomingServices.toString(),
      description: "This week",
      icon: Calendar,
      link: "#",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Clergy Dashboard</h1>
            <p className="text-muted-foreground">Loading dashboard statistics...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Clergy Dashboard</h1>
          <p className="text-muted-foreground">Manage your spiritual content and connect with your congregation</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsConfig.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground mb-3">{stat.description}</p>
                {stat.link !== "#" && (
                  <Link to={stat.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      View All
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Create and manage your spiritual content</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/clergy/sermons">
                <Button className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Manage Sermons</span>
                </Button>
              </Link>
              <Link to="/clergy/prayers">
                <Button variant="secondary" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Heart className="h-6 w-6" />
                  <span>Manage Prayers</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.title}</p>
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

export default ClergyDashboard;