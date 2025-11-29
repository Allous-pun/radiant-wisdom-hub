// components/LearningMaterialManagement.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, BookOpen, Upload, Download, Eye, Video, FileText, Image, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface LearningMaterial {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: 'pdf' | 'video' | 'note' | 'image';
  fileUrl?: {
    filename: string;
    size: number;
  };
  externalLink?: string;
  thumbnailUrl?: {
    filename: string;
  };
  tags: string[];
  createdBy: {
    _id: string;
    name: string;
    profile?: {
      photo?: string;
    };
  };
  numberOfDownloads: number;
  numberOfViews: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const LearningMaterialManagement = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<LearningMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Bible Studies",
    type: "pdf" as "pdf" | "video" | "note" | "image",
    externalLink: "",
    tags: "",
    isPublished: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);

  // Fetch all materials
  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      
      const data = await response.json();
      setMaterials(data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to load materials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories and tags
  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/materials/categories`),
        fetch(`${API_BASE_URL}/materials/tags`)
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.data?.categories || []);
      }

      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setTags(tagsData.data?.tags || []);
      }
    } catch (error) {
      console.error('Error fetching categories/tags:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMaterials();
      fetchCategoriesAndTags();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to manage materials",
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.type) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate type-specific requirements
    if (formData.type === 'video' && !formData.externalLink && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "Video materials require either a file upload or external link",
        variant: "destructive",
      });
      return;
    }

    if (formData.type !== 'video' && !selectedFile) {
      toast({
        title: "Validation Error",
        description: "File upload is required for this material type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('isPublished', formData.isPublished.toString());

      if (formData.externalLink) {
        formDataToSend.append('externalLink', formData.externalLink);
      }

      if (selectedFile) {
        formDataToSend.append('fileUrl', selectedFile);
      }

      if (selectedThumbnail) {
        formDataToSend.append('thumbnailUrl', selectedThumbnail);
      }

      let response;
      if (editingMaterial) {
        // Update material
        response = await fetch(`${API_BASE_URL}/materials/${editingMaterial._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        // Create new material
        response = await fetch(`${API_BASE_URL}/materials`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to ${editingMaterial ? 'update' : 'create'} material`);
      }

      await fetchMaterials(); // Refresh the list
      toast({ 
        title: `Material ${editingMaterial ? 'updated' : 'created'} successfully` 
      });
      resetForm();
    } catch (error: any) {
      console.error('Error saving material:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingMaterial ? 'update' : 'create'} material`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (material: LearningMaterial) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      category: material.category,
      type: material.type,
      externalLink: material.externalLink || '',
      tags: material.tags.join(', '),
      isPublished: material.isPublished,
    });
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to delete materials",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete material');
      }

      setMaterials(materials.filter((m) => m._id !== id));
      toast({ 
        title: "Material deleted successfully",
        variant: "destructive" 
      });
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (material: LearningMaterial) => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials/${material._id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.fileUrl?.filename || `${material.title}.${material.type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "File download has started",
      });
    } catch (error) {
      console.error('Error downloading material:', error);
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
      category: "Bible Studies",
      type: "pdf",
      externalLink: "",
      tags: "",
      isPublished: true,
    });
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setEditingMaterial(null);
    setIsDialogOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'note': return <StickyNote className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'video': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case 'image': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'note': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <BookOpen className="h-8 w-8 animate-pulse text-primary" />
            <span className="ml-2 text-lg">Loading materials...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Learning Material Management</h1>
          <p className="text-muted-foreground">Manage educational materials and resources for students and clergy</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Learning Materials</CardTitle>
                <CardDescription>
                  View and manage all learning materials ({materials.length} materials)
                </CardDescription>
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
                      {editingMaterial ? "Update material details" : "Create a new learning material for students and clergy"}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        placeholder="Enter material description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <select
                          id="category"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          required
                          disabled={isSubmitting}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="type">Type *</Label>
                        <select
                          id="type"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                          required
                          disabled={isSubmitting}
                        >
                          <option value="pdf">PDF Document</option>
                          <option value="video">Video</option>
                          <option value="image">Image</option>
                          <option value="note">Note</option>
                        </select>
                      </div>
                    </div>

                    {formData.type === 'video' && (
                      <div>
                        <Label htmlFor="externalLink">External Video Link (YouTube/Vimeo)</Label>
                        <Input
                          id="externalLink"
                          type="url"
                          value={formData.externalLink}
                          onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                          disabled={isSubmitting}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Provide external link for videos OR upload a video file below
                        </p>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="file">
                        {formData.type === 'video' ? 'Video File (Optional if external link provided)' : 'File Upload *'}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          disabled={isSubmitting}
                          accept={
                            formData.type === 'pdf' ? '.pdf' :
                            formData.type === 'video' ? 'video/*' :
                            formData.type === 'image' ? 'image/*' :
                            '*/*'
                          }
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {selectedFile && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="thumbnail">Thumbnail Image (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="thumbnail"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedThumbnail(e.target.files?.[0] || null)}
                          disabled={isSubmitting}
                        />
                        <Image className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {selectedThumbnail && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Selected: {selectedThumbnail.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        disabled={isSubmitting}
                        placeholder="bible, study, theology, etc."
                      />
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
                        {isSubmitting ? "Processing..." : editingMaterial ? "Update Material" : "Create Material"}
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
                  placeholder="Search by title, description, category, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {materials.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No learning materials found</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Get started by creating your first learning material
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(material.type)}
                            <span className="max-w-xs truncate">{material.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{material.category}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(material.type)}`}>
                            {material.type.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          {material.fileUrl ? (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="text-xs truncate max-w-xs">
                                {material.fileUrl.filename} ({formatFileSize(material.fileUrl.size)})
                              </span>
                            </div>
                          ) : material.externalLink ? (
                            <div className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              <span className="text-xs text-muted-foreground">External Video</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              material.isPublished
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {material.isPublished ? "Published" : "Draft"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">{material.numberOfDownloads}</TableCell>
                        <TableCell className="text-sm">{formatDate(material.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {material.fileUrl && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownload(material)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {material.externalLink && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.open(material.externalLink, '_blank')}
                                title="View External Link"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
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
                              onClick={() => handleDelete(material._id)}
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