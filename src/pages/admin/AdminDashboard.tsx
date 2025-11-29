import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Heart, Book, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "248",
      description: "+12 this week",
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Sermons",
      value: "156",
      description: "24 published this month",
      icon: BookOpen,
      link: "/admin/sermons",
    },
    {
      title: "Prayers",
      value: "89",
      description: "18 added recently",
      icon: Heart,
      link: "/admin/prayers",
    },
    {
      title: "Books",
      value: "42",
      description: "PDFs available",
      icon: Book,
      link: "/admin/books",
    },
    {
      title: "Assignments",
      value: "31",
      description: "15 pending review",
      icon: FileText,
      link: "/admin/assignments",
    },
    {
      title: "Learning Materials",
      value: "67",
      description: "Active resources",
      icon: Calendar,
      link: "/admin/learning-materials",
    },
  ];

  const recentActivity = [
    { action: "New user registered", user: "John Doe", time: "5 minutes ago" },
    { action: "Sermon published", user: "Eugene Choge", time: "1 hour ago" },
    { action: "Prayer added", user: "Pastor Mark", time: "3 hours ago" },
    { action: "Assignment submitted", user: "Sarah Johnson", time: "5 hours ago" },
    { action: "Book uploaded", user: "Eugene Choge", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all aspects of Teacher of Excellence platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
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
              <Link to="/admin/books">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                  <Book className="h-5 w-5" />
                  <span className="text-sm">Upload Books</span>
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
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex flex-col space-y-1 border-b pb-3 last:border-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.user}</p>
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

export default AdminDashboard;
