import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const ClergyDashboard = () => {
  const stats = [
    {
      title: "My Sermons",
      value: "24",
      description: "Published sermons",
      icon: BookOpen,
      link: "/clergy/sermons",
    },
    {
      title: "My Prayers",
      value: "18",
      description: "Shared prayers",
      icon: Heart,
      link: "/clergy/prayers",
    },
    {
      title: "Church Members",
      value: "156",
      description: "Active members",
      icon: Users,
      link: "#",
    },
    {
      title: "Upcoming Services",
      value: "3",
      description: "This week",
      icon: Calendar,
      link: "#",
    },
  ];

  const recentActivity = [
    { action: "Published sermon", title: "Walking in Faith", time: "2 hours ago" },
    { action: "Added prayer", title: "Prayer for Healing", time: "1 day ago" },
    { action: "Updated sermon", title: "Grace and Mercy", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Clergy Dashboard</h1>
          <p className="text-muted-foreground">Manage your spiritual content and connect with your congregation</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClergyDashboard;
