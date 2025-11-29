import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sermon {
  id: number;
  title: string;
  date: string;
  scripture: string;
  description: string;
  status: "draft" | "published";
}

const SermonManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);

  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: 1,
      title: "Walking in Faith",
      date: "2024-01-15",
      scripture: "Hebrews 11:1",
      description: "Understanding what it means to walk by faith and not by sight",
      status: "published",
    },
    {
      id: 2,
      title: "Grace and Mercy",
      date: "2024-01-08",
      scripture: "Ephesians 2:8-9",
      description: "Exploring God's amazing grace and boundless mercy",
      status: "published",
    },
    {
      id: 3,
      title: "The Power of Prayer",
      date: "2024-01-22",
      scripture: "James 5:16",
      description: "How prayer transforms our lives and communities",
      status: "draft",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    scripture: "",
    description: "",
    status: "draft" as "draft" | "published",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSermon) {
      setSermons(sermons.map((s) => (s.id === editingSermon.id ? { ...formData, id: s.id } : s)));
      toast({ title: "Sermon updated successfully" });
    } else {
      const newSermon = { ...formData, id: sermons.length + 1 };
      setSermons([...sermons, newSermon]);
      toast({ title: "Sermon created successfully" });
    }
    resetForm();
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setFormData(sermon);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setSermons(sermons.filter((s) => s.id !== id));
    toast({ title: "Sermon deleted successfully" });
  };

  const resetForm = () => {
    setFormData({ title: "", date: "", scripture: "", description: "", status: "draft" });
    setEditingSermon(null);
    setIsAddDialogOpen(false);
  };

  const filteredSermons = sermons.filter((sermon) =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.scripture.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Sermon Management</h1>
          <p className="text-muted-foreground">Create and manage your sermons</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Sermons</CardTitle>
                <CardDescription>Manage your sermon content</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sermon
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingSermon ? "Edit Sermon" : "Add New Sermon"}</DialogTitle>
                    <DialogDescription>
                      {editingSermon ? "Update sermon details" : "Create a new sermon"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="scripture">Scripture Reference</Label>
                      <Input
                        id="scripture"
                        value={formData.scripture}
                        onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                        placeholder="e.g., John 3:16"
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
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingSermon ? "Update" : "Create"}</Button>
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
                  placeholder="Search sermons..."
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
                    <TableHead>Date</TableHead>
                    <TableHead>Scripture</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSermons.map((sermon) => (
                    <TableRow key={sermon.id}>
                      <TableCell className="font-medium">{sermon.title}</TableCell>
                      <TableCell>{new Date(sermon.date).toLocaleDateString()}</TableCell>
                      <TableCell>{sermon.scripture}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            sermon.status === "published"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sermon.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(sermon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(sermon.id)}>
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

export default SermonManagement;
