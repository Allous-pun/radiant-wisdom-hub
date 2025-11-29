import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Sermon {
  _id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  image?: string;
  audioFile?: string;
  videoLink?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const SermonManagement = () => {
  const { toast } = useToast();
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    tags: "",
    videoLink: "",
    image: null as File | null,
    audio: null as File | null,
    isPublished: false,
  });

  const categories = ["Faith", "Salvation", "Grace", "Prayer", "Worship", "Leadership", "Family", "Hope", "Love", "Other"];

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch all sermons and filter by current user
  const fetchMySermons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sermons`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sermons');
      }
      
      const data = await response.json();
      const allSermons = data.data || [];
      const mySermons = allSermons.filter((sermon: Sermon) => sermon.author._id === user?._id);
      setSermons(mySermons);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast({
        title: "Error",
        description: "Failed to load sermons",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchMySermons();
    }
  }, [token, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('videoLink', formData.videoLink);
      formDataToSend.append('isPublished', formData.isPublished.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      if (formData.audio) {
        formDataToSend.append('audio', formData.audio);
      }

      let response;
      if (editingSermon) {
        // Update sermon
        response = await fetch(`${API_BASE_URL}/sermons/${editingSermon._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create new sermon
        response = await fetch(`${API_BASE_URL}/sermons`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save sermon');
      }

      toast({
        title: editingSermon ? "Sermon updated successfully" : "Sermon created successfully",
      });

      await fetchMySermons();
      resetForm();
    } catch (error) {
      console.error('Error saving sermon:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save sermon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setFormData({
      title: sermon.title,
      summary: sermon.summary,
      content: sermon.content,
      category: sermon.category,
      tags: sermon.tags.join(','),
      videoLink: sermon.videoLink || "",
      image: null,
      audio: null,
      isPublished: sermon.isPublished,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sermon?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/sermons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete sermon');
      }

      toast({ title: "Sermon deleted successfully" });
      await fetchMySermons();
    } catch (error) {
      console.error('Error deleting sermon:', error);
      toast({
        title: "Error",
        description: "Failed to delete sermon",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: "", 
      summary: "", 
      content: "", 
      category: "", 
      tags: "", 
      videoLink: "", 
      image: null, 
      audio: null, 
      isPublished: false 
    });
    setEditingSermon(null);
    setIsAddDialogOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, audio: e.target.files[0] });
    }
  };

  const filteredSermons = sermons.filter((sermon) =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
                <CardTitle>My Sermons</CardTitle>
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
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea
                        id="summary"
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                        rows={2}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Full Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        disabled={isLoading}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="faith, transformation, spiritual-growth"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="videoLink">Video Link (Optional)</Label>
                      <Input
                        id="videoLink"
                        type="url"
                        value={formData.videoLink}
                        onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                        placeholder="https://youtube.com/example-sermon"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image">Image (Optional)</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="audio">Audio File (Optional)</Label>
                      <Input
                        id="audio"
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={formData.isPublished}
                        onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                        disabled={isLoading}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="isPublished">Publish immediately</Label>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : editingSermon ? "Update" : "Create"}
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
                    <TableHead>Category</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSermons.map((sermon) => (
                    <TableRow key={sermon._id}>
                      <TableCell className="font-medium">{sermon.title}</TableCell>
                      <TableCell>{sermon.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {sermon.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(sermon.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            sermon.isPublished
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sermon.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(sermon)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(sermon._id)}>
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