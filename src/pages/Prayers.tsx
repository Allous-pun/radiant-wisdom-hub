import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useToast } from "@/hooks/use-toast";

interface Prayer {
  _id: string;
  title: string;
  image: string;
  category: string;
  author: {
    _id: string;
    name: string;
    profile: {
      photo: string;
    };
  };
  createdAt: string;
}

interface PrayersResponse {
  status: string;
  message: string;
  data: Prayer[];
  meta: {
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

const Prayers = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  const fetchPrayers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prayers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayers');
      }
      
      const data: PrayersResponse = await response.json();
      setPrayers(data.data);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      toast({
        title: "Error",
        description: "Failed to load prayers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading prayers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center animate-fade-in">
          <Heart className="h-16 w-16 mx-auto mb-4 text-secondary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Prayers</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guided prayers for every need. Let these words inspire your personal communion with God.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prayers.map((prayer, index) => (
            <Card 
              key={prayer._id}
              className="hover:shadow-warm transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-2">
                  {prayer.category}
                </div>
                <CardTitle className="text-xl">{prayer.title}</CardTitle>
                <CardDescription>
                  By {prayer.author.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <NavLink to={`/prayers/${prayer._id}`}>
                    Read Prayer
                  </NavLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {prayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No prayers found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prayers;