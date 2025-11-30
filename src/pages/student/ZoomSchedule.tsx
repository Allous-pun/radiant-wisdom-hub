import { useState, useEffect } from "react";
import { Video, Calendar, Clock, ExternalLink, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ZoomMeeting {
  _id: string;
  title: string;
  description: string;
  meetingLink: string;
  scheduledDate: string;
  createdBy: {
    _id: string;
    name: string;
    profile?: {
      photo?: string;
    };
  };
  isActive: boolean;
  createdAt: string;
}

const ZoomSchedule = () => {
  const { token } = useAuth();
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch Zoom meetings
  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/zoom`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Zoom meetings');
      }
      
      const data = await response.json();
      setMeetings(data.data || []);
    } catch (error) {
      console.error('Error fetching Zoom meetings:', error);
      toast({
        title: "Error",
        description: "Failed to load Zoom meetings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMeetings();
    }
  }, [token]);

  const handleJoinMeeting = (meeting: ZoomMeeting) => {
    toast({
      title: "Joining Meeting",
      description: `Opening Zoom for "${meeting.title}"...`,
    });
    window.open(meeting.meetingLink, "_blank");
  };

  const handleCopyMeetingLink = (meetingLink: string) => {
    navigator.clipboard.writeText(meetingLink);
    toast({
      title: "Copied",
      description: "Meeting link copied to clipboard",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isUpcoming = (scheduledDate: string) => {
    return new Date(scheduledDate) > new Date();
  };

  const isOngoing = (scheduledDate: string) => {
    const now = new Date();
    const startTime = new Date(scheduledDate);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    return now >= startTime && now <= endTime;
  };

  const getMeetingStatus = (meeting: ZoomMeeting) => {
    if (!meeting.isActive) {
      return { status: 'cancelled', label: 'Cancelled', variant: 'destructive' as const };
    }
    
    if (isOngoing(meeting.scheduledDate)) {
      return { status: 'ongoing', label: 'Live Now', variant: 'default' as const };
    }
    
    if (isUpcoming(meeting.scheduledDate)) {
      return { status: 'upcoming', label: 'Upcoming', variant: 'secondary' as const };
    }
    
    return { status: 'completed', label: 'Completed', variant: 'outline' as const };
  };

  const getStatusBadge = (meeting: ZoomMeeting) => {
    const { label, variant } = getMeetingStatus(meeting);
    
    switch (variant) {
      case "secondary":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />{label}</Badge>;
      case "default":
        return <Badge variant="default" className="gap-1 bg-primary/20 text-primary border-primary/30"><Video className="h-3 w-3" />{label}</Badge>;
      case "destructive":
        return <Badge variant="destructive" className="gap-1">{label}</Badge>;
      case "outline":
        return <Badge variant="outline" className="gap-1">{label}</Badge>;
      default:
        return null;
    }
  };

  const upcomingMeetings = meetings.filter(meeting => {
    const status = getMeetingStatus(meeting);
    return status.status === 'upcoming' || status.status === 'ongoing';
  });

  const pastMeetings = meetings.filter(meeting => {
    const status = getMeetingStatus(meeting);
    return status.status === 'completed' || status.status === 'cancelled';
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <Video className="h-8 w-8 animate-pulse text-primary" />
            <span className="ml-2 text-lg">Loading Zoom meetings...</span>
          </div>
        </div>
      </div>
    );
  }

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
            Upcoming Classes ({upcomingMeetings.length})
          </h2>
          {upcomingMeetings.length === 0 ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardContent className="pt-6 text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No upcoming classes scheduled</p>
                <p className="text-muted-foreground text-sm mt-2">Check back later for new classes</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingMeetings.map((meeting) => {
                const status = getMeetingStatus(meeting);
                
                return (
                  <Card key={meeting._id} className="border-border/50 bg-card/50 backdrop-blur hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Video className="h-6 w-6 text-primary" />
                        {getStatusBadge(meeting)}
                      </div>
                      <CardTitle className="text-xl">{meeting.title}</CardTitle>
                      <CardDescription>{meeting.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{meeting.createdBy.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(meeting.scheduledDate)}</span>
                        </div>
                        <div className="pt-2 border-t border-border/30">
                          <div className="flex gap-2">
                            {(status.status === 'upcoming' || status.status === 'ongoing') && meeting.isActive && (
                              <>
                                <Button 
                                  onClick={() => handleJoinMeeting(meeting)} 
                                  className="flex-1 gap-2"
                                  variant={status.status === 'ongoing' ? 'default' : 'outline'}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  {status.status === 'ongoing' ? 'Join Live Meeting' : 'Join Meeting'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleCopyMeetingLink(meeting.meetingLink)}
                                >
                                  Copy Link
                                </Button>
                              </>
                            )}
                            {!meeting.isActive && (
                              <Button variant="outline" disabled className="flex-1">
                                Meeting Cancelled
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-muted-foreground" />
              Past Classes ({pastMeetings.length})
            </h2>
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <Card key={meeting._id} className="border-border/50 bg-card/50 backdrop-blur opacity-75">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">{meeting.title}</h3>
                          {getStatusBadge(meeting)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span>Instructor: {meeting.createdBy.name}</span>
                          <span>{formatDate(meeting.scheduledDate)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {meetings.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No classes available</h3>
            <p className="text-muted-foreground">Check back later for scheduled classes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoomSchedule;