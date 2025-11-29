import { useState, useEffect } from "react";
import { FileText, Upload, Calendar, Clock, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  materials: Array<{
    _id: string;
    title: string;
    type: string;
  }>;
  fileUrl?: {
    filename: string;
    size: number;
  };
  createdBy: {
    _id: string;
    name: string;
  };
  isPublished: boolean;
  createdAt: string;
}

interface Submission {
  _id: string;
  assignmentId: Assignment;
  message?: string;
  fileUrl?: {
    filename: string;
    size: number;
  };
  submittedAt: string;
  graded: boolean;
  grade: string;
  feedback?: string;
  gradedAt?: string;
}

const Assignments = () => {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch assignments and submissions
  const fetchData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/assignments`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
          } : {},
        }),
        fetch(`${API_BASE_URL}/assignments/submissions/my`, {
          headers: token ? {
            'Authorization': `Bearer ${token}`,
          } : {},
        })
      ]);

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.data || []);
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json();
        setSubmissions(submissionsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!token || !currentAssignment) return;

    if (!selectedFile && !submissionNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide either a file or submission notes",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('fileUrl', selectedFile);
      }
      if (submissionNotes.trim()) {
        formData.append('message', submissionNotes);
      }

      const response = await fetch(`${API_BASE_URL}/assignments/${currentAssignment._id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit assignment');
      }

      toast({
        title: "Assignment Submitted",
        description: `Your submission for "${currentAssignment.title}" has been received.`,
      });

      // Refresh data
      await fetchData();
      
      setSelectedFile(null);
      setSubmissionNotes("");
      setIsDialogOpen(false);
      setCurrentAssignment(null);
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to submit assignment',
        variant: "destructive",
      });
    }
  };

  const handleDownloadAssignmentFile = async (assignment: Assignment) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${assignment._id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = assignment.fileUrl?.filename || `${assignment.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "File download has started",
      });
    } catch (error) {
      console.error('Error downloading assignment file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleDownloadMaterialFile = async (materialId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${materialId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download material');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `material_${materialId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Material download has started",
      });
    } catch (error) {
      console.error('Error downloading material:', error);
      toast({
        title: "Error",
        description: "Failed to download material",
        variant: "destructive",
      });
    }
  };

  const openSubmissionDialog = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsDialogOpen(true);
  };

  const getSubmissionStatus = (assignment: Assignment) => {
    const submission = submissions.find(sub => sub.assignmentId._id === assignment._id);
    
    if (!submission) {
      return { status: 'pending', submission: null };
    }
    
    if (submission.graded) {
      return { status: 'graded', submission };
    }
    
    return { status: 'submitted', submission };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "submitted":
        return <Badge variant="default" className="gap-1 bg-primary/20 text-primary border-primary/30"><CheckCircle2 className="h-3 w-3" />Submitted</Badge>;
      case "graded":
        return <Badge variant="default" className="gap-1 bg-accent/20 text-accent-foreground border-accent/30"><CheckCircle2 className="h-3 w-3" />Graded</Badge>;
      default:
        return null;
    }
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <FileText className="h-8 w-8 animate-pulse text-primary" />
            <span className="ml-2 text-lg">Loading assignments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Assignments</h1>
          <p className="text-muted-foreground">View and submit your course assignments</p>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {assignments.map((assignment) => {
            const { status, submission } = getSubmissionStatus(assignment);
            const overdue = isPastDue(assignment.dueDate);
            
            return (
              <Card key={assignment._id} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{assignment.title}</CardTitle>
                        {getStatusBadge(status)}
                        {overdue && status === 'pending' && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Overdue
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-2">{assignment.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(assignment.dueDate)}</span>
                        </div>
                        <div>Instructor: {assignment.createdBy.name}</div>
                        {submission?.graded && (
                          <div className="font-semibold text-foreground">
                            Grade: {submission.grade}
                          </div>
                        )}
                      </div>

                      {status === "pending" && !overdue && (
                        <Dialog open={isDialogOpen && currentAssignment?._id === assignment._id} onOpenChange={(open) => {
                          setIsDialogOpen(open);
                          if (!open) setCurrentAssignment(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button onClick={() => openSubmissionDialog(assignment)} className="gap-2">
                              <Upload className="h-4 w-4" />
                              Submit Assignment
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Submit Assignment</DialogTitle>
                              <DialogDescription>
                                Upload your completed work for "{assignment.title}"
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="file">Upload File</Label>
                                <Input
                                  id="file"
                                  type="file"
                                  onChange={handleFileChange}
                                  accept=".pdf,.doc,.docx,.txt,image/*"
                                />
                                {selectedFile && (
                                  <p className="text-sm text-muted-foreground">
                                    Selected: {selectedFile.name}
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="notes">Submission Notes (Optional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Add any notes or comments for your instructor..."
                                  value={submissionNotes}
                                  onChange={(e) => setSubmissionNotes(e.target.value)}
                                  rows={4}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleSubmit}>Submit</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {status === "submitted" && submission && (
                        <Badge variant="outline" className="gap-2">
                          Submitted on {formatDate(submission.submittedAt)}
                        </Badge>
                      )}

                      {status === "graded" && submission && (
                        <div className="text-right">
                          <div className="font-semibold">Grade: {submission.grade}</div>
                          {submission.feedback && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Feedback: {submission.feedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Assignment Resources */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm mb-2">Assignment Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignment.fileUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadAssignmentFile(assignment)}
                            className="gap-2"
                          >
                            <Download className="h-3 w-3" />
                            Assignment File
                          </Button>
                        )}
                        {assignment.materials.map((material) => (
                          <Button
                            key={material._id}
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadMaterialFile(material._id)}
                            className="gap-2"
                          >
                            <Download className="h-3 w-3" />
                            {material.title}
                          </Button>
                        ))}
                        {!assignment.fileUrl && assignment.materials.length === 0 && (
                          <span className="text-sm text-muted-foreground">No additional resources</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No assignments available</h3>
            <p className="text-muted-foreground">Check back later for new assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;