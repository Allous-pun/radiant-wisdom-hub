import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download } from "lucide-react";

const mockBooks = [
  {
    id: 1,
    title: "Foundations of Faith",
    author: "Eugene Kololi Choge",
    type: "Spiritual Book",
    pages: 156,
    description: "A comprehensive guide to building unshakeable faith and understanding core biblical principles.",
  },
  {
    id: 2,
    title: "The Power of Intercessory Prayer",
    author: "Eugene Kololi Choge",
    type: "Prayer Guide",
    pages: 98,
    description: "Learn the art and power of intercession and how to pray effectively for others.",
  },
  {
    id: 3,
    title: "Walking in Divine Purpose",
    author: "Eugene Kololi Choge",
    type: "Life Purpose",
    pages: 134,
    description: "Discover and walk confidently in God's unique calling and purpose for your life.",
  },
  {
    id: 4,
    title: "Journal of Spiritual Insights - Vol 1",
    author: "Eugene Kololi Choge",
    type: "Journal",
    pages: 78,
    description: "A collection of prophetic insights, revelations, and spiritual wisdom.",
  },
  {
    id: 5,
    title: "Biblical Leadership Principles",
    author: "Eugene Kololi Choge",
    type: "Leadership",
    pages: 189,
    description: "Timeless leadership lessons from scripture for modern church leaders.",
  },
  {
    id: 6,
    title: "The Discipleship Manual",
    author: "Eugene Kololi Choge",
    type: "Training Material",
    pages: 112,
    description: "A practical guide for making disciples and growing in spiritual maturity.",
  },
];

const Books = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center animate-fade-in">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Books & Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download spiritual books, journals, and educational materials to deepen your understanding and faith.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBooks.map((book, index) => (
            <Card 
              key={book.id}
              className="hover:shadow-warm transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="aspect-[3/4] bg-gradient-primary rounded-md mb-4 flex items-center justify-center">
                  <BookOpen className="h-20 w-20 text-white opacity-50" />
                </div>
                <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-2">
                  {book.type}
                </div>
                <CardTitle className="text-xl">{book.title}</CardTitle>
                <CardDescription className="text-sm">
                  By {book.author} • {book.pages} pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{book.description}</p>
                <Button className="w-full bg-gradient-primary">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
