import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
    email: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const Sermons = () => {
  const { toast } = useToast();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch all published sermons
  const fetchSermons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sermons`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sermons');
      }
      
      const data = await response.json();
      // Filter only published sermons for public view
      const publishedSermons = (data.data || []).filter((sermon: Sermon) => sermon.isPublished);
      setSermons(publishedSermons);
    } catch (error) {
      console.error('Error fetching sermons:', error);
      toast({
        title: "Error",
        description: "Failed to load sermons",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDuration = (content: string | undefined) => {
    // Estimate reading time based on content length
    const wordsPerMinute = 200;
    if (!content) return '1 min read';
    
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons</h1>
            <p className="text-lg text-muted-foreground">Loading sermons...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful messages to inspire, encourage, and strengthen your faith journey.
          </p>
        </div>

        {sermons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No sermons available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon, index) => (
              <Card 
                key={sermon._id} 
                className="hover:shadow-warm transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{sermon.title?.replace(/"/g, '') || 'Untitled Sermon'}</CardTitle>
                  <CardDescription className="text-sm">
                    {sermon.category?.replace(/"/g, '') || 'General'} • By {sermon.author?.name || 'Unknown Author'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {sermon.summary?.replace(/"/g, '') || 'No summary available.'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(sermon.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getDuration(sermon.content)}</span>
                    </div>
                  </div>

                  {sermon.tags && sermon.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {sermon.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                        >
                          {tag?.replace(/"/g, '')}
                        </span>
                      ))}
                      {sermon.tags.length > 3 && (
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                          +{sermon.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <Button variant="outline" className="w-full" asChild>
                    <NavLink to={`/sermons/${sermon._id}`}>
                      Read Sermon
                    </NavLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sermons;