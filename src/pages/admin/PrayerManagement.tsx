import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prayer {
  id: number;
  title: string;
  category: string;
  author: string;
  content: string;
  date: string;
  status: "draft" | "published";
}

const PrayerManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);

  const [prayers, setPrayers] = useState<Prayer[]>([
    {
      id: 1,
      title: "Prayer for Healing",
      category: "Healing",
      author: "Eugene Choge",
      content: "Lord, we come before you seeking your healing touch...",
      date: "2024-01-14",
      status: "published",
    },
    {
      id: 2,
      title: "Prayer for Guidance",
      category: "Guidance",
      author: "Pastor Mark",
      content: "Heavenly Father, guide our steps and illuminate our path...",
      date: "2024-01-10",
      status: "published",
    },
    {
      id: 3,
      title: "Prayer for Peace",
      category: "Peace",
      author: "Eugene Choge",
      content: "Prince of Peace, calm the storms in our lives...",
      date: "2024-01-20",
      status: "draft",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    content: "",
    date: "",
    status: "draft" as "draft" | "published",
  });

  const categories = ["Healing", "Guidance", "Peace", "Thanksgiving", "Protection", "Wisdom", "Strength", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPrayer) {
      setPrayers(prayers.map((p) => (p.id === editingPrayer.id ? { ...formData, id: p.id } : p)));
      toast({ title: "Prayer updated successfully" });
    } else {
      const newPrayer = { ...formData, id: prayers.length + 1 };
      setPrayers([...prayers, newPrayer]);
      toast({ title: "Prayer created successfully" });
    }
    resetForm();
  };

  const handleEdit = (prayer: Prayer) => {
    setEditingPrayer(prayer);
    setFormData(prayer);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPrayers(prayers.filter((p) => p.id !== id));
    toast({ title: "Prayer deleted successfully", variant: "destructive" });
  };

  const resetForm = () => {
    setFormData({ title: "", category: "", author: "", content: "", date: "", status: "draft" });
    setEditingPrayer(null);
    setIsAddDialogOpen(false);
  };

  const filteredPrayers = prayers.filter(
    (prayer) =>
      prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.author.toLowerCase().includes(searchQuery.toLowerCase())
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
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                      <Label htmlFor="content">Prayer Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
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
                      <Button type="submit">{editingPrayer ? "Update" : "Create"}</Button>
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
                    <TableRow key={prayer.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          {prayer.title}
                        </div>
                      </TableCell>
                      <TableCell>{prayer.category}</TableCell>
                      <TableCell>{prayer.author}</TableCell>
                      <TableCell>{new Date(prayer.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            prayer.status === "published"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {prayer.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(prayer)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(prayer.id)}>
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
