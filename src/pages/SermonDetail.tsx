import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SermonResponse {
  status: string;
  message: string;
  data: {
    sermon: Sermon;
  };
}

const SermonDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch specific sermon
  const fetchSermon = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/sermons/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sermon');
      }
      
      const data: SermonResponse = await response.json();
      setSermon(data.data.sermon);
    } catch (error) {
      console.error('Error fetching sermon:', error);
      toast({
        title: "Error",
        description: "Failed to load sermon",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSermon();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading sermon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Sermon Not Found</h1>
          <p className="text-muted-foreground mb-6">The sermon you're looking for doesn't exist.</p>
          <Button asChild>
            <NavLink to="/sermons">
              Back to Sermons
            </NavLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto animate-fade-in">
        <Button variant="ghost" className="mb-6" asChild>
          <NavLink to="/sermons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sermons
          </NavLink>
        </Button>

        <Card>
          <CardContent className="pt-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{sermon.title.replace(/"/g, '')}</h1>
            <p className="text-xl text-secondary mb-2">{sermon.summary.replace(/"/g, '')}</p>
            <p className="text-muted-foreground mb-4">
              {sermon.category.replace(/"/g, '')} • By {sermon.author?.name || 'Unknown Author'}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(sermon.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{getDuration(sermon.content)}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {sermon.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag.replace(/"/g, '')}
                </span>
              ))}
            </div>

            {/* Media Links */}
            {(sermon.videoLink || sermon.audioFile) && (
              <div className="mb-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">Media Resources</h3>
                <div className="flex gap-4">
                  {sermon.videoLink && (
                    <Button asChild variant="outline">
                      <a href={sermon.videoLink} target="_blank" rel="noopener noreferrer">
                        Watch Video
                      </a>
                    </Button>
                  )}
                  {sermon.audioFile && (
                    <Button asChild variant="outline">
                      <a href={sermon.audioFile} target="_blank" rel="noopener noreferrer">
                        Listen to Audio
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Sermon Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: sermon.content 
                  .replace(/"/g, '')
                  .split('\n')
                  .map(paragraph => {
                    const trimmed = paragraph.trim();
                    if (trimmed.startsWith('<h2>') || trimmed.startsWith('<h3>') || trimmed.startsWith('<h4>')) {
                      return trimmed;
                    }
                    return trimmed ? `<p>${trimmed}</p>` : '';
                  })
                  .join('') 
              }}
            />

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-semibold text-lg mb-2">About the Speaker</h3>
              <p className="text-muted-foreground">
                {sermon.author?.name || 'Unknown Author'} is dedicated to sharing God's word and helping believers grow in their faith journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SermonDetail;