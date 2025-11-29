import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Prayer {
  _id: string;
  title: string;
  category: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const PrayerManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: null as File | null,
    isPublished: false,
  });

  const categories = ["Healing", "Guidance", "Peace", "Thanksgiving", "Protection", "Wisdom", "Strength", "Morning Prayer", "Evening Prayer", "Other"];

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch all prayers
  const fetchPrayers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prayers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayers');
      }
      
      const data = await response.json();
      // FIX: Access the data array directly from response
      setPrayers(data.data || []);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      toast({
        title: "Error",
        description: "Failed to load prayers",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchPrayers();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('isPublished', formData.isPublished.toString());
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      let response;
      if (editingPrayer) {
        // Update prayer
        response = await fetch(`${API_BASE_URL}/prayers/${editingPrayer._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create new prayer
        response = await fetch(`${API_BASE_URL}/prayers`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save prayer');
      }

      toast({
        title: editingPrayer ? "Prayer updated successfully" : "Prayer created successfully",
      });

      await fetchPrayers();
      resetForm();
    } catch (error) {
      console.error('Error saving prayer:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save prayer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (prayer: Prayer) => {
    setEditingPrayer(prayer);
    setFormData({
      title: prayer.title,
      category: prayer.category,
      content: prayer.content,
      image: null,
      isPublished: prayer.isPublished,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prayer?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/prayers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete prayer');
      }

      toast({ title: "Prayer deleted successfully" });
      await fetchPrayers();
    } catch (error) {
      console.error('Error deleting prayer:', error);
      toast({
        title: "Error",
        description: "Failed to delete prayer",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", content: "", image: null, isPublished: false });
    setEditingPrayer(null);
    setIsAddDialogOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const filteredPrayers = prayers.filter(
    (prayer) =>
      prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Prayer Management</h1>
          <p className="text-muted-foreground">Manage prayers and devotionals</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Prayers</CardTitle>
                <CardDescription>Create, edit, and publish prayers</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Prayer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingPrayer ? "Edit Prayer" : "Add New Prayer"}</DialogTitle>
                    <DialogDescription>
                      {editingPrayer ? "Update prayer details" : "Create a new prayer"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Prayer Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                      <Label htmlFor="content">Prayer Content</Label>
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
                      <Label htmlFor="image">Image (Optional)</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
                        {isLoading ? "Saving..." : editingPrayer ? "Update" : "Create"}
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
                  placeholder="Search prayers..."
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
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrayers.map((prayer) => (
                    <TableRow key={prayer._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          {prayer.title}
                        </div>
                      </TableCell>
                      <TableCell>{prayer.category}</TableCell>
                      <TableCell>{prayer.author.name}</TableCell>
                      <TableCell>{new Date(prayer.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            prayer.isPublished
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {prayer.isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(prayer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(prayer._id)}>
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

export default PrayerManagement;