import { useState } from "react";
import { FileText, Upload, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status: "pending" | "submitted" | "graded";
  grade?: number;
  submittedAt?: string;
}

const Assignments = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);

  // Mock data
  const assignments: Assignment[] = [
    {
      id: 1,
      title: "Biblical Exegesis Paper",
      description: "Write a 5-page paper analyzing a selected biblical passage using historical-critical methods.",
      dueDate: "2024-01-20",
      points: 100,
      status: "pending",
    },
    {
      id: 2,
      title: "Prayer Journal Reflection",
      description: "Submit a reflection on your prayer practices over the past two weeks.",
      dueDate: "2024-01-18",
      points: 50,
      status: "pending",
    },
    {
      id: 3,
      title: "Theology Discussion Post",
      description: "Participate in the online forum discussion on Reformed theology.",
      dueDate: "2024-01-15",
      points: 25,
      status: "submitted",
      submittedAt: "2024-01-14",
    },
    {
      id: 4,
      title: "Church History Timeline",
      description: "Create a comprehensive timeline of major events in church history from 100 AD to 500 AD.",
      dueDate: "2024-01-10",
      points: 75,
      status: "graded",
      grade: 68,
      submittedAt: "2024-01-09",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to submit",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Assignment Submitted",
      description: `Your submission for "${currentAssignment?.title}" has been received.`,
    });

    setSelectedFile(null);
    setSubmissionNotes("");
    setIsDialogOpen(false);
    setCurrentAssignment(null);
  };

  const openSubmissionDialog = (assignment: Assignment) => {
    setCurrentAssignment(assignment);
    setIsDialogOpen(true);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Assignments</h1>
          <p className="text-muted-foreground">View and submit your course assignments</p>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{assignment.title}</CardTitle>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <CardDescription className="mt-2">{assignment.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {assignment.dueDate}</span>
                      {assignment.status === "pending" && isPastDue(assignment.dueDate) && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>Points: {assignment.points}</div>
                    {assignment.grade && (
                      <div className="font-semibold text-foreground">
                        Grade: {assignment.grade}/{assignment.points}
                      </div>
                    )}
                  </div>

                  {assignment.status === "pending" && (
                    <Dialog open={isDialogOpen && currentAssignment?.id === assignment.id} onOpenChange={(open) => {
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
                              accept=".pdf,.doc,.docx,.txt"
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

                  {assignment.status === "submitted" && (
                    <Badge variant="outline" className="gap-2">
                      Submitted on {assignment.submittedAt}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
