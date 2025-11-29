import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, BookOpen, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  fileName?: string;
  fileDataUrl?: string;
  createdAt: string;
}

const STORAGE_KEY = "learning_materials_local_v1";

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

const LearningMaterialManagement = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    fileName: "",
    fileDataUrl: "",
  });

  const subjects = ["Mathematics", "English", "Science", "History", "Geography", "Religious Studies", "Theology", "Philosophy", "Other"];
  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMaterials(JSON.parse(stored) as LearningMaterial[]);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
      toast({
        title: "Error",
        description: "Failed to load materials from storage",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Save to localStorage whenever materials change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    } catch (error) {
      console.error("Error saving materials:", error);
    }
  }, [materials]);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileDataUrl: result,
      }));
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      level: "",
      fileName: "",
      fileDataUrl: "",
    });
    setEditingMaterial(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.subject || !formData.level) {
        toast({
          title: "Validation Error",
          description: "Title, description, subject, and level are required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (editingMaterial) {
        // Update existing material
        setMaterials((prev) =>
          prev.map((m) =>
            m.id === editingMaterial.id
              ? {
                  ...m,
                  title: formData.title.trim(),
                  description: formData.description.trim(),
                  subject: formData.subject,
                  level: formData.level,
                  fileName: formData.fileName || m.fileName,
                  fileDataUrl: formData.fileDataUrl || m.fileDataUrl,
                }
              : m
          )
        );
        toast({
          title: "Success",
          description: "Learning material updated successfully",
        });
      } else {
        // Create new material
        const newMaterial: LearningMaterial = {
          id: generateId(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          subject: formData.subject,
          level: formData.level,
          fileName: formData.fileName,
          fileDataUrl: formData.fileDataUrl,
          createdAt: new Date().toISOString(),
        };
        setMaterials((prev) => [newMaterial, ...prev]);
        toast({
          title: "Success",
          description: "Learning material created successfully",
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving material:", error);
      toast({
        title: "Error",
        description: "Failed to save learning material",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (material: LearningMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      subject: material.subject,
      level: material.level,
      fileName: material.fileName || "",
      fileDataUrl: material.fileDataUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast({
        title: "Success",
        description: "Learning material deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Error",
        description: "Failed to delete learning material",
        variant: "destructive",
      });
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Learning Material Management</h1>
          <p className="text-muted-foreground">Manage educational materials and resources (Local Storage)</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Learning Materials</CardTitle>
                <CardDescription>Create and manage learning materials ({materials.length} total)</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingMaterial ? "Edit Learning Material" : "Add New Learning Material"}</DialogTitle>
                    <DialogDescription>
                      {editingMaterial ? "Update material details" : "Create a new learning material"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Material Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        disabled={isLoading}
                        placeholder="Enter material title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                        disabled={isLoading}
                        placeholder="Enter material description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <select
                          id="subject"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          disabled={isLoading}
                        >
                          <option value="">Select a subject</option>
                          {subjects.map((subj) => (
                            <option key={subj} value={subj}>
                              {subj}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="level">Level *</Label>
                        <select
                          id="level"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          required
                          disabled={isLoading}
                        >
                          <option value="">Select a level</option>
                          {levels.map((lev) => (
                            <option key={lev} value={lev}>
                              {lev}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="file">Upload File (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          type="file"
                          accept="image/*,application/pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {formData.fileName && (
                        <p className="text-xs text-muted-foreground mt-2">Attached: {formData.fileName}</p>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : editingMaterial ? "Update Material" : "Create Material"}
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
                  placeholder="Search by title, description, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? "No materials found matching your search." : "No learning materials yet."}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="max-w-xs truncate">{material.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{material.subject}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                            {material.level}
                          </span>
                        </TableCell>
                        <TableCell>
                          {material.fileName ? (
                            <div className="flex items-center gap-1">
                              <Upload className="h-3 w-3" />
                              <span className="text-xs truncate max-w-xs">{material.fileName}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(material.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(material)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(material.id)}
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
      </div>
    </div>
  );
};

export default LearningMaterialManagement;