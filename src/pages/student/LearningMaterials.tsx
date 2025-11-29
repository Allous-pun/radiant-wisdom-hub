import { useState, useEffect } from "react";
import { Book, FileText, Video, Download, Search, Image, StickyNote, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
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
  createdAt: string;
  updatedAt: string;
}

const LearningMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<LearningMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch all materials from API
  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/materials`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      
      const data = await response.json();
      setMaterials(data.data || []);
      setFilteredMaterials(data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast({
        title: "Error",
        description: "Failed to load learning materials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filter materials based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMaterials(materials);
    } else {
      const filtered = materials.filter(
        (material) =>
          material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMaterials(filtered);
    }
  }, [searchQuery, materials]);

  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText;
      case "video":
        return Video;
      case "image":
        return Image;
      case "note":
        return StickyNote;
      default:
        return Book;
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case "pdf":
        return "PDF";
      case "video":
        return "Video";
      case "image":
        return "Image";
      case "note":
        return "Note";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'video':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case 'image':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'note':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleDownload = async (material: LearningMaterial) => {
    try {
      if (material.externalLink) {
        // For external videos, open in new tab
        window.open(material.externalLink, '_blank');
        toast({
          title: "Opening Video",
          description: `Opening ${material.title} in new tab...`,
        });
        return;
      }

      if (!material.fileUrl) {
        toast({
          title: "Error",
          description: "No file available for download",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/materials/${material._id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = material.fileUrl.filename || `${material.title}.${material.type}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `Downloading ${material.title}...`,
      });

      // Refresh to update download count
      fetchMaterials();
    } catch (error) {
      console.error('Error downloading material:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleView = (material: LearningMaterial) => {
    if (material.externalLink) {
      window.open(material.externalLink, '_blank');
    } else if (material.fileUrl) {
      // For files, open in new tab for viewing
      window.open(`${API_BASE_URL}/materials/${material._id}/file`, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
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
            <Book className="h-8 w-8 animate-pulse text-primary" />
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
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Learning Materials</h1>
          <p className="text-muted-foreground">Access your course materials and resources</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search materials by title, category, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const Icon = getIcon(material.type);
            const isExternalVideo = material.type === 'video' && material.externalLink;
            
            return (
              <Card key={material._id} className="hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getTypeColor(material.type)}>
                        {getTypeDisplayName(material.type)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {material.category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{material.title}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {material.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Tags */}
                  {material.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {material.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{material.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* File Info */}
                  <div className="text-sm text-muted-foreground mb-3">
                    {material.fileUrl && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span className="text-xs">
                          {material.fileUrl.filename} • {formatFileSize(material.fileUrl.size)}
                        </span>
                      </div>
                    )}
                    {isExternalVideo && (
                      <div className="flex items-center gap-1">
                        <Video className="h-3 w-3" />
                        <span className="text-xs">External Video Link</span>
                      </div>
                    )}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>By: {material.createdBy.name}</span>
                      <span>Added: {formatDate(material.createdAt)}</span>
                      <div className="flex gap-2 mt-1">
                        <span>📥 {material.numberOfDownloads}</span>
                        <span>👁️ {material.numberOfViews}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {isExternalVideo ? (
                        <Button
                          size="sm"
                          onClick={() => handleView(material)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Watch
                        </Button>
                      ) : (
                        <>
                          {material.fileUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(material)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleDownload(material)}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No materials found" : "No materials available"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Check back later for new learning materials"
              }
            </p>
          </div>
        )}

        {/* Results Count */}
        {filteredMaterials.length > 0 && (
          <div className="mt-6 text-center text-muted-foreground">
            Showing {filteredMaterials.length} of {materials.length} materials
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningMaterials;