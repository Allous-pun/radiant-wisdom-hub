import { useState } from "react";
import { Book, FileText, Video, Download, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Material {
  id: number;
  title: string;
  description: string;
  type: "PDF" | "Video" | "Document";
  category: string;
  uploadedAt: string;
  fileUrl: string;
}

const LearningMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const materials: Material[] = [
    {
      id: 1,
      title: "Introduction to Scripture",
      description: "Comprehensive guide to understanding biblical texts and their historical context.",
      type: "PDF",
      category: "Biblical Studies",
      uploadedAt: "2024-01-10",
      fileUrl: "/materials/intro-scripture.pdf",
    },
    {
      id: 2,
      title: "Prayer and Meditation Guide",
      description: "Practical approaches to developing a consistent prayer life and meditation practice.",
      type: "Video",
      category: "Spiritual Formation",
      uploadedAt: "2024-01-08",
      fileUrl: "/materials/prayer-guide.mp4",
    },
    {
      id: 3,
      title: "Christian Ethics",
      description: "Exploring moral principles and decision-making from a Christian perspective.",
      type: "PDF",
      category: "Theology",
      uploadedAt: "2024-01-05",
      fileUrl: "/materials/christian-ethics.pdf",
    },
    {
      id: 4,
      title: "Church History Overview",
      description: "Journey through major events and movements in church history from apostolic times to present.",
      type: "Document",
      category: "History",
      uploadedAt: "2024-01-03",
      fileUrl: "/materials/church-history.docx",
    },
    {
      id: 5,
      title: "Worship and Liturgy",
      description: "Understanding different worship styles and the elements of liturgical practice.",
      type: "Video",
      category: "Worship",
      uploadedAt: "2024-01-01",
      fileUrl: "/materials/worship-liturgy.mp4",
    },
  ];

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return FileText;
      case "Video":
        return Video;
      default:
        return Book;
    }
  };

  const handleDownload = (material: Material) => {
    toast({
      title: "Download Started",
      description: `Downloading ${material.title}...`,
    });
    // Placeholder for actual download logic
  };

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
              placeholder="Search materials by title or category..."
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
            return (
              <Card key={material.id} className="hover:shadow-lg transition-shadow border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">{material.type}</Badge>
                  </div>
                  <CardTitle className="text-xl">{material.title}</CardTitle>
                  <CardDescription className="text-sm">{material.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{material.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Uploaded: {material.uploadedAt}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(material)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No materials found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningMaterials;
