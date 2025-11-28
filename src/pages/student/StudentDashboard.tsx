import { Book, FileText, Video, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const stats = [
    { label: "Learning Materials", value: "12", icon: Book, link: "/student/materials" },
    { label: "Pending Assignments", value: "3", icon: FileText, link: "/student/assignments" },
    { label: "Upcoming Zoom Classes", value: "2", icon: Video, link: "/student/zoom-schedule" },
    { label: "Completed Assignments", value: "8", icon: Calendar, link: "/student/assignments" },
  ];

  const upcomingClasses = [
    { id: 1, title: "Biblical Studies 101", date: "2024-01-15", time: "10:00 AM" },
    { id: 2, title: "Theology and Practice", date: "2024-01-18", time: "2:00 PM" },
  ];

  const recentMaterials = [
    { id: 1, title: "Introduction to Scripture", type: "PDF", uploadedAt: "2024-01-10" },
    { id: 2, title: "Prayer and Meditation Guide", type: "Video", uploadedAt: "2024-01-08" },
    { id: 3, title: "Christian Ethics", type: "PDF", uploadedAt: "2024-01-05" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
