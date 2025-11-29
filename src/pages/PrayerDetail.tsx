import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart } from "lucide-react";
import { NavLink, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PrayerDetail {
  _id: string;
  title: string;
  image: string;
  category: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profile: {
      photo: string;
    };
  };
  createdAt: string;
}

interface PrayerResponse {
  status: string;
  message: string;
  data: PrayerDetail;
}

const PrayerDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [prayer, setPrayer] = useState<PrayerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  const fetchPrayer = async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/prayers/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer');
      }
      
      const data: PrayerResponse = await response.json();
      setPrayer(data.data);
    } catch (error) {
      console.error('Error fetching prayer:', error);
      toast({
        title: "Error",
        description: "Failed to load prayer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayer();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading prayer...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Prayer Not Found</h1>
          <p className="text-muted-foreground mb-6">The prayer you're looking for doesn't exist.</p>
          <Button asChild>
            <NavLink to="/prayers">
              Back to Prayers
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
          <NavLink to="/prayers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prayers
          </NavLink>
        </Button>

        <Card>
          <CardContent className="pt-8">
            <Heart className="h-12 w-12 text-secondary mb-4" />
            <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-3">
              {prayer.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{prayer.title}</h1>
            <p className="text-muted-foreground mb-6">
              By {prayer.author.name} • {formatDate(prayer.createdAt)}
            </p>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: prayer.content 
                  .split('\n')
                  .map(paragraph => {
                    if (paragraph.trim().startsWith('<h2>') || paragraph.trim().startsWith('<h3>')) {
                      return paragraph;
                    }
                    return `<p>${paragraph}</p>`;
                  })
                  .join('') 
              }}
            />

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-semibold text-lg mb-2">About the Author</h3>
              <p className="text-muted-foreground">
                {prayer.author.name} is dedicated to sharing prayers and helping believers grow in their spiritual journey.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrayerDetail;