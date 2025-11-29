import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, FileText, Calendar, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  materials: string[];
  fileUrl?: {
    filename: string;
    size: number;
  };
  createdBy: {
    _id: string;
    name: string;
    profile?: {
      photo?: string;
    };
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AssignmentSubmission {
  _id: string;
  assignmentId: Assignment;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
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

const AssignmentManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmissionsDialogOpen, setIsSubmissionsDialogOpen] = useState(false);
  const [isGradingDialogOpen, setIsGradingDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    materials: "",
    isPublished: true,
  });

  const [gradingData, setGradingData] = useState({
    grade: "Pending",
    feedback: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch all assignments
  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assignments');
      }
      
      const data = await response.json();
      setAssignments(data.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch submissions for an assignment
  const fetchSubmissions = async (assignmentId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchAssignments();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage assignments",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.dueDate) {
      toast({
        title: "Validation Error",
        description: "Title, description, and due date are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dueDate', formData.dueDate);
      formDataToSend.append('materials', formData.materials);
      formDataToSend.append('isPublished', formData.isPublished.toString());

      if (selectedFile) {
        formDataToSend.append('fileUrl', selectedFile);
      }

      let response;
      if (editingAssignment) {
        // Update assignment
        response = await fetch(`${API_BASE_URL}/assignments/${editingAssignment._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create new assignment
        response = await fetch(`${API_BASE_URL}/assignments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${editingAssignment ? 'update' : 'create'} assignment`);
      }

      await fetchAssignments(); // Refresh the list
      toast({ 
        title: `Assignment ${editingAssignment ? 'updated' : 'created'} successfully` 
      });
      resetForm();
    } catch (error: any) {
      console.error('Error saving assignment:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingAssignment ? 'update' : 'create'} assignment`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.split('T')[0], // Format date for input
      materials: assignment.materials.join(', '),
      isPublished: assignment.isPublished,
    });
    setSelectedFile(null);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      return;
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to delete assignments",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      setAssignments(assignments.filter((a) => a._id !== id));
      toast({ 
        title: "Assignment deleted successfully",
        variant: "destructive" 
      });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    }
  };

  const handleViewSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    await fetchSubmissions(assignment._id);
    setIsSubmissionsDialogOpen(true);
  };

  const handleGradeSubmission = (submission: AssignmentSubmission) => {
    setSelectedSubmission(submission);
    setGradingData({
      grade: submission.grade,
      feedback: submission.feedback || ''
    });
    setIsGradingDialogOpen(true);
  };

  const handleSubmitGrade = async () => {
    if (!token || !selectedSubmission) return;

    try {
      const response = await fetch(`${API_BASE_URL}/assignments/submissions/${selectedSubmission._id}/grade`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gradingData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to grade submission');
      }

      if (selectedAssignment) {
        await fetchSubmissions(selectedAssignment._id); // Refresh submissions
      }
      
      toast({ title: 'Submission graded successfully' });
      setIsGradingDialogOpen(false);
      setSelectedSubmission(null);
    } catch (error: any) {
      console.error('Error grading submission:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to grade submission',
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

  const handleDownloadSubmissionFile = async (submission: AssignmentSubmission) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/submissions/${submission._id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = submission.fileUrl?.filename || `submission_${submission.assignmentId.title}_${submission.studentId.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "File download has started",
      });
    } catch (error) {
      console.error('Error downloading submission file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      materials: "",
      isPublished: true,
    });
    setSelectedFile(null);
    setEditingAssignment(null);
    setIsAddDialogOpen(false);
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Assignment Management</h1>
          <p className="text-muted-foreground">Create and manage student assignments</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Assignments</CardTitle>
                <CardDescription>Create assignments and track student submissions</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingAssignment ? "Edit Assignment" : "Create New Assignment"}</DialogTitle>
                    <DialogDescription>
                      {editingAssignment ? "Update assignment details" : "Create a new assignment for students"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Assignment Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter assignment title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter assignment description and instructions"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dueDate">Due Date *</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <Label htmlFor="materials">Related Materials (Optional)</Label>
                        <Input
                          id="materials"
                          value={formData.materials}
                          onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                          disabled={isSubmitting}
                          placeholder="Material IDs separated by commas"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="file">Assignment File (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          disabled={isSubmitting}
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </div>
                      {selectedFile && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="isPublished">Status</Label>
                      <select
                        id="isPublished"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.isPublished.toString()}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === "true" })}
                        disabled={isSubmitting}
                      >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
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
                        {isSubmitting ? "Processing..." : editingAssignment ? "Update Assignment" : "Create Assignment"}
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
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No assignments found</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Get started by creating your first assignment
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((assignment) => (
                      <TableRow key={assignment._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <div>{assignment.title}</div>
                              {isOverdue(assignment.dueDate) && (
                                <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Overdue</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              assignment.isPublished
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {assignment.isPublished ? "Published" : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {assignment.fileUrl ? (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="text-xs truncate max-w-xs">
                                {assignment.fileUrl.filename} ({formatFileSize(assignment.fileUrl.size)})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(assignment.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {assignment.fileUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadAssignmentFile(assignment)}
                                title="Download File"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewSubmissions(assignment)}
                              title="View Submissions"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(assignment)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(assignment._id)}
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

        {/* Submissions Dialog */}
        <Dialog open={isSubmissionsDialogOpen} onOpenChange={setIsSubmissionsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submissions for {selectedAssignment?.title}</DialogTitle>
              <DialogDescription>
                View and grade student submissions for this assignment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <Card key={submission._id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{submission.studentId.name}</span>
                              <span className="text-sm text-muted-foreground">{submission.studentId.email}</span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              Submitted: {formatDate(submission.submittedAt)}
                            </div>
                            {submission.message && (
                              <p className="text-sm mb-3">{submission.message}</p>
                            )}
                            {submission.fileUrl && (
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm">{submission.fileUrl.filename}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadSubmissionFile(submission)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                            <div className="flex items-center gap-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                submission.graded 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}>
                                {submission.graded ? `Graded: ${submission.grade}` : 'Pending'}
                              </span>
                              {submission.feedback && (
                                <span className="text-sm text-muted-foreground">
                                  Feedback: {submission.feedback}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGradeSubmission(submission)}
                          >
                            {submission.graded ? 'Update Grade' : 'Grade'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Grading Dialog */}
        <Dialog open={isGradingDialogOpen} onOpenChange={setIsGradingDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Grade Submission</DialogTitle>
              <DialogDescription>
                Grade submission from {selectedSubmission?.studentId.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <select
                  id="grade"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={gradingData.grade}
                  onChange={(e) => setGradingData({ ...gradingData, grade: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="D-">D-</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div>
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  value={gradingData.feedback}
                  onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                  rows={4}
                  placeholder="Provide feedback for the student..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsGradingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitGrade}>
                  Submit Grade
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AssignmentManagement;