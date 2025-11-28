import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const mockSermons = [
  {
    id: 1,
    title: "Walking in Faith: A Journey of Trust",
    description: "Discover the power of unwavering faith and how to trust God in every season of life.",
    date: "March 15, 2024",
    duration: "45 min",
    scripture: "Hebrews 11:1-6",
  },
  {
    id: 2,
    title: "The Power of Prayer and Intercession",
    description: "Learn how to develop a powerful prayer life that moves mountains and transforms circumstances.",
    date: "March 8, 2024",
    duration: "38 min",
    scripture: "James 5:16-18",
  },
  {
    id: 3,
    title: "Living in Divine Purpose",
    description: "Understanding your calling and walking confidently in the purpose God has designed for you.",
    date: "March 1, 2024",
    duration: "52 min",
    scripture: "Jeremiah 29:11-13",
  },
  {
    id: 4,
    title: "Overcoming Spiritual Warfare",
    description: "Equipping believers with spiritual weapons to stand firm against the enemy's schemes.",
    date: "February 23, 2024",
    duration: "41 min",
    scripture: "Ephesians 6:10-18",
  },
  {
    id: 5,
    title: "The Gift of Grace and Mercy",
    description: "Exploring God's unconditional love and the transformative power of His grace in our lives.",
    date: "February 16, 2024",
    duration: "36 min",
    scripture: "Ephesians 2:4-9",
  },
  {
    id: 6,
    title: "Building Strong Foundations",
    description: "Establishing your life on the solid rock of Christ's teachings and promises.",
    date: "February 9, 2024",
    duration: "44 min",
    scripture: "Matthew 7:24-27",
  },
];

const Sermons = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful messages to inspire, encourage, and strengthen your faith journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSermons.map((sermon, index) => (
            <Card 
              key={sermon.id} 
              className="hover:shadow-warm transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl">{sermon.title}</CardTitle>
                <CardDescription className="text-sm">{sermon.scripture}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{sermon.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{sermon.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{sermon.duration}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <NavLink to={`/sermons/${sermon.id}`}>
                    Read Sermon
                  </NavLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sermons;
