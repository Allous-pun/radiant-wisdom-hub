import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status: "active" | "closed";
  submissions: number;
  zoomLink?: string;
}

const AssignmentManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Biblical Exegesis Paper",
      description: "Write a 5-page paper analyzing a chosen biblical passage",
      dueDate: "2024-02-15",
      points: 100,
      status: "active",
      submissions: 12,
      zoomLink: "https://zoom.us/j/123456789",
    },
    {
      id: 2,
      title: "Theology Discussion Forum",
      description: "Participate in the weekly theological discussion forum",
      dueDate: "2024-02-08",
      points: 50,
      status: "active",
      submissions: 24,
    },
    {
      id: 3,
      title: "Church History Timeline",
      description: "Create a comprehensive timeline of major church history events",
      dueDate: "2024-01-30",
      points: 75,
      status: "closed",
      submissions: 18,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: 100,
    status: "active" as "active" | "closed",
    zoomLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === editingAssignment.id ? { ...formData, id: a.id, submissions: a.submissions } : a
        )
      );
      toast({ title: "Assignment updated successfully" });
    } else {
      const newAssignment = { ...formData, id: assignments.length + 1, submissions: 0 };
      setAssignments([...assignments, newAssignment]);
      toast({ title: "Assignment created successfully" });
    }
    resetForm();
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points,
      status: assignment.status,
      zoomLink: assignment.zoomLink || "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter((a) => a.id !== id));
    toast({ title: "Assignment deleted successfully", variant: "destructive" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      points: 100,
      status: "active",
      zoomLink: "",
    });
    setEditingAssignment(null);
    setIsAddDialogOpen(false);
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                      <Label htmlFor="title">Assignment Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          type="number"
                          value={formData.points}
                          onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zoomLink">Zoom Meeting Link (Optional)</Label>
                      <Input
                        id="zoomLink"
                        type="url"
                        value={formData.zoomLink}
                        onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                        placeholder="https://zoom.us/j/..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add a Zoom link if there's a live session for this assignment
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "closed" })}
                      >
                        <option value="active">Active</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingAssignment ? "Update" : "Create"}</Button>
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <div>
                            <div>{assignment.title}</div>
                            {assignment.zoomLink && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>Has Zoom meeting</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{assignment.points} pts</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            assignment.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </TableCell>
                      <TableCell>{assignment.submissions} submissions</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(assignment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(assignment.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentManagement;
