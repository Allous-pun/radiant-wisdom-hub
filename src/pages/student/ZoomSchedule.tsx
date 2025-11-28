import { Video, Calendar, Clock, ExternalLink, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ZoomMeeting {
  id: number;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  zoomLink: string;
  meetingId: string;
  status: "upcoming" | "ongoing" | "completed";
}

const ZoomSchedule = () => {
  // Mock data
  const meetings: ZoomMeeting[] = [
    {
      id: 1,
      title: "Biblical Studies 101",
      description: "Introduction to Old Testament prophetic literature and interpretation methods.",
      instructor: "Eugene Kololi Choge",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "90 minutes",
      zoomLink: "https://zoom.us/j/1234567890",
      meetingId: "123 456 7890",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Theology and Practice",
      description: "Exploring the relationship between theological understanding and practical Christian living.",
      instructor: "Eugene Kololi Choge",
      date: "2024-01-18",
      time: "2:00 PM",
      duration: "60 minutes",
      zoomLink: "https://zoom.us/j/0987654321",
      meetingId: "098 765 4321",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Prayer and Spiritual Formation",
      description: "Deep dive into contemplative prayer practices and spiritual disciplines.",
      instructor: "Eugene Kololi Choge",
      date: "2024-01-22",
      time: "11:00 AM",
      duration: "75 minutes",
      zoomLink: "https://zoom.us/j/1122334455",
      meetingId: "112 233 4455",
      status: "upcoming",
    },
    {
      id: 4,
      title: "Church History Review",
      description: "Review session covering early church councils and theological developments.",
      instructor: "Eugene Kololi Choge",
      date: "2024-01-10",
      time: "3:00 PM",
      duration: "60 minutes",
      zoomLink: "https://zoom.us/j/5544332211",
      meetingId: "554 433 2211",
      status: "completed",
    },
  ];

  const handleJoinMeeting = (meeting: ZoomMeeting) => {
    toast({
      title: "Joining Meeting",
      description: `Opening Zoom for "${meeting.title}"...`,
    });
    // Placeholder for actual Zoom link opening
    window.open(meeting.zoomLink, "_blank");
  };

  const handleCopyMeetingId = (meetingId: string) => {
    navigator.clipboard.writeText(meetingId.replace(/\s/g, ""));
    toast({
      title: "Copied",
      description: "Meeting ID copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Upcoming</Badge>;
      case "ongoing":
        return <Badge variant="default" className="gap-1 bg-primary/20 text-primary border-primary/30"><Video className="h-3 w-3" />Live Now</Badge>;
      case "completed":
        return <Badge variant="outline" className="gap-1">Completed</Badge>;
      default:
        return null;
    }
  };

  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming" || m.status === "ongoing");
  const pastMeetings = meetings.filter((m) => m.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Zoom Class Schedule</h1>
          <p className="text-muted-foreground">View and join your scheduled online classes</p>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Upcoming Classes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingMeetings.map((meeting) => (
              <Card key={meeting.id} className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Video className="h-6 w-6 text-primary" />
                    {getStatusBadge(meeting.status)}
                  </div>
                  <CardTitle className="text-xl">{meeting.title}</CardTitle>
                  <CardDescription>{meeting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{meeting.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time} • {meeting.duration}</span>
                    </div>
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-xs text-muted-foreground mb-2">Meeting ID: {meeting.meetingId}</p>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleJoinMeeting(meeting)} 
                          className="flex-1 gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Join Meeting
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleCopyMeetingId(meeting.meetingId)}
                        >
                          Copy ID
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-muted-foreground" />
              Past Classes
            </h2>
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id} className="border-border/50 bg-card/50 backdrop-blur opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                          {getStatusBadge(meeting.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>{meeting.date}</span>
                          <span>{meeting.time}</span>
                          <span>{meeting.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoomSchedule;
