import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About Eugene Kololi Choge</h1>
        
        <div className="mb-12">
          <div className="aspect-video bg-muted rounded-lg mb-8 flex items-center justify-center">
            <p className="text-muted-foreground">Photo of Eugene Kololi Choge</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="prose prose-lg max-w-none pt-6">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">The Journey</h2>
            <p className="text-muted-foreground mb-4">
              Eugene Kololi Choge is a devoted spiritual teacher and minister with a profound calling to share divine wisdom 
              and guide believers in their faith journey. His ministry combines biblical teachings with practical life applications, 
              creating a transformative learning experience for all who seek spiritual growth.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-secondary mt-8">Ministry & Calling</h2>
            <p className="text-muted-foreground mb-4">
              Called to ministry at an early age, Eugene has dedicated his life to serving others through teaching, 
              preaching, and pastoral care. His approach emphasizes the importance of understanding scripture in context 
              and applying divine principles to everyday life challenges.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-secondary mt-8">Experience & Education</h2>
            <p className="text-muted-foreground mb-4">
              With years of theological training and practical ministry experience, Eugene brings depth and authenticity 
              to his teachings. He has served in various capacities within the church, mentored numerous spiritual leaders, 
              and continues to expand his reach through online education and digital ministry.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-secondary mt-8">Mission</h2>
            <p className="text-muted-foreground">
              The mission of Teacher of Excellence is to provide accessible, high-quality spiritual education that equips 
              believers with the knowledge, wisdom, and practical tools needed for victorious Christian living. Through sermons, 
              prayers, books, and interactive learning, Eugene seeks to build a community of empowered disciples who can 
              impact their world for the kingdom of God.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary text-white">
          <CardContent className="pt-6">
            <blockquote className="text-xl italic text-center py-6">
              "Excellence in teaching comes from a heart surrendered to God's purpose and a commitment 
              to serving His people with wisdom, love, and unwavering faith."
            </blockquote>
            <p className="text-center font-semibold">— Eugene Kololi Choge</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
