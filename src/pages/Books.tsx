import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookItem {
  _id: string;
  title: string;
  authorName: string;
  description: string;
  category: string;
  coverImage?: {
    filename: string;
    contentType: string;
  };
  pdfFile: {
    filename: string;
    contentType: string;
    size: number;
  };
  uploadedBy: {
    _id: string;
    name: string;
  };
  numberOfDownloads: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const Books = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      // Filter only published books for public view
      const publishedBooks = (data.data?.books || data.data || []).filter(
        (book: BookItem) => book.isPublished
      );
      setBooks(publishedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDownload = async (bookId: string, bookTitle: string) => {
    setDownloadingId(bookId);
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download book');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Update download count in local state
      setBooks(books.map(book => 
        book._id === bookId 
          ? { ...book, numberOfDownloads: book.numberOfDownloads + 1 }
          : book
      ));

      toast({ 
        title: "Download started",
        description: `${bookTitle} is being downloaded`
      });
    } catch (error) {
      console.error('Error downloading book:', error);
      toast({
        title: "Error",
        description: "Failed to download book",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const getCoverImageUrl = (book: BookItem) => {
    if (book.coverImage?.filename) {
      return `${API_BASE_URL}/books/${book._id}/cover`;
    }
    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading books...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-12 text-center animate-fade-in">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Books & Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download spiritual books, journals, and educational materials to deepen your understanding and faith.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {books.length} book{books.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-24 w-24 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Books Available</h3>
            <p className="text-muted-foreground">
              Check back later for new books and resources.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book, index) => {
              const coverImageUrl = getCoverImageUrl(book);
              return (
                <Card 
                  key={book._id}
                  className="hover:shadow-warm transition-all duration-300 animate-slide-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="aspect-[3/4] bg-gradient-primary rounded-md mb-4 flex items-center justify-center overflow-hidden">
                      {coverImageUrl ? (
                        <img 
                          src={coverImageUrl} 
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <BookOpen className="h-20 w-20 text-white opacity-50" />
                      )}
                    </div>
                    <div className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-2">
                      {book.category}
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="text-sm">
                      By {book.authorName} • {formatFileSize(book.pdfFile.size)}
                    </CardDescription>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Download className="h-3 w-3 mr-1" />
                      {book.numberOfDownloads} download{book.numberOfDownloads !== 1 ? 's' : ''}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {book.description}
                    </p>
                    <Button 
                      className="w-full bg-gradient-primary"
                      onClick={() => handleDownload(book._id, book.title)}
                      disabled={downloadingId === book._id}
                    >
                      {downloadingId === book._id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;