import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Heart, Users, Video } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to Teacher of Excellence
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Journey with Eugene Kololi Choge through spiritual wisdom, divine teachings, and transformative learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-warm">
              <NavLink to="/register">Start Your Journey</NavLink>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <NavLink to="/about">Learn More</NavLink>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Resources</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access a wealth of spiritual content, educational materials, and community support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Sermons</CardTitle>
                <CardDescription>
                  Powerful messages and teachings to inspire your spiritual journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0 text-primary" asChild>
                  <NavLink to="/sermons">Explore Sermons →</NavLink>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <Heart className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Prayers</CardTitle>
                <CardDescription>
                  Guided prayers for strength, healing, and divine connection.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0 text-primary" asChild>
                  <NavLink to="/prayers">View Prayers →</NavLink>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Books & Resources</CardTitle>
                <CardDescription>
                  Download spiritual books, journals, and educational materials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0 text-primary" asChild>
                  <NavLink to="/books">Browse Library →</NavLink>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Join live classes and connect with fellow learners.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="link" className="p-0 text-primary" asChild>
                  <NavLink to="/register">Join Now →</NavLink>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-secondary text-white">
        <div className="container max-w-3xl mx-auto text-center">
          <Video className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Begin Your Spiritual Education</h2>
          <p className="text-lg mb-8 text-white/90">
            Register today to access exclusive learning materials, live Zoom classes, and personalized guidance.
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-warm">
            <NavLink to="/register">Create Free Account</NavLink>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
