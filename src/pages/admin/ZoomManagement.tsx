import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Video, ExternalLink, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  updatedAt: string;
}

const ZoomManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<ZoomMeeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingLink: "",
    scheduledDate: "",
    isActive: true,
  });

  // Fetch all Zoom meetings
  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/zoom/admin/my-meetings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage Zoom meetings",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.meetingLink || !formData.scheduledDate) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    // Validate meeting link
    if (!formData.meetingLink.startsWith('https://')) {
      toast({
        title: "Validation Error",
        description: "Meeting link must start with https://",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (editingMeeting) {
        // Update meeting
        response = await fetch(`${API_BASE_URL}/zoom/${editingMeeting._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new meeting
        response = await fetch(`${API_BASE_URL}/zoom`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${editingMeeting ? 'update' : 'create'} meeting`);
      }

      await fetchMeetings(); // Refresh the list
      toast({ 
        title: `Zoom meeting ${editingMeeting ? 'updated' : 'scheduled'} successfully` 
      });
      resetForm();
    } catch (error: any) {
      console.error('Error saving Zoom meeting:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingMeeting ? 'update' : 'create'} meeting`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (meeting: ZoomMeeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description,
      meetingLink: meeting.meetingLink,
      scheduledDate: meeting.scheduledDate.split('T')[0] + 'T' + meeting.scheduledDate.split('T')[1].substring(0, 5),
      isActive: meeting.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Zoom meeting? This action cannot be undone.')) {
      return;
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to delete meetings",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/zoom/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete meeting');
      }

      setMeetings(meetings.filter((m) => m._id !== id));
      toast({ 
        title: "Zoom meeting deleted successfully",
        variant: "destructive" 
      });
    } catch (error) {
      console.error('Error deleting Zoom meeting:', error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/zoom/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update meeting status');
      }

      await fetchMeetings(); // Refresh the list
      toast({ 
        title: `Meeting ${isActive ? 'activated' : 'deactivated'} successfully` 
      });
    } catch (error: any) {
      console.error('Error updating meeting status:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to update meeting status',
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      meetingLink: "",
      scheduledDate: "",
      isActive: true,
    });
    setEditingMeeting(null);
    setIsDialogOpen(false);
  };

  const filteredMeetings = meetings.filter(
    (meeting) =>
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    return <Badge variant={variant}>{label}</Badge>;
  };

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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Zoom Meeting Management</h1>
          <p className="text-muted-foreground">Schedule, manage, and organize online classes and meetings</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Meetings</CardTitle>
                <CardDescription>Manage Zoom meetings and class schedules ({meetings.length} meetings)</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingMeeting ? "Edit Meeting" : "Schedule New Meeting"}</DialogTitle>
                    <DialogDescription>
                      {editingMeeting ? "Update meeting details" : "Create a new Zoom meeting or class"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Meeting Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Biblical Studies 101"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the meeting or class"
                        rows={3}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="meetingLink">Zoom Link *</Label>
                      <Input
                        id="meetingLink"
                        type="url"
                        value={formData.meetingLink}
                        onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                        placeholder="https://zoom.us/j/..."
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="scheduledDate">Scheduled Date & Time *</Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={formData.scheduledDate}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Label htmlFor="isActive">Status</Label>
                      <select
                        id="isActive"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.isActive.toString()}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                        disabled={isSubmitting}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetForm}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : editingMeeting ? "Update Meeting" : "Schedule Meeting"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search meetings by title, instructor, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {meetings.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? "No meetings found matching your search." : "No meetings scheduled yet."}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeetings.map((meeting) => (
                      <TableRow key={meeting._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-primary" />
                            <div>
                              <div>{meeting.title}</div>
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {meeting.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{meeting.createdBy.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(meeting.scheduledDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(meeting)}
                            <select
                              value={meeting.isActive.toString()}
                              onChange={(e) => handleStatusChange(meeting._id, e.target.value === "true")}
                              className="text-xs border rounded px-2 py-1"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(meeting.meetingLink, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Join
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(meeting)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(meeting._id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meetings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meetings.filter(m => getMeetingStatus(m).status === 'upcoming').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Live Now</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{meetings.filter(m => getMeetingStatus(m).status === 'ongoing').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{meetings.filter(m => m.isActive).length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ZoomManagement;