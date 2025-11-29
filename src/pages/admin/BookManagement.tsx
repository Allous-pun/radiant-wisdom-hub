import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Book, Upload, FileText, Download } from "lucide-react";
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

const BookManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [books, setBooks] = useState<BookItem[]>([]);

  const API_BASE_URL = 'https://excellence-choge.onrender.com/api';
  
  // Get token from localStorage (assuming you store it there after login)
  const getAuthToken = () => {
    return localStorage.getItem('adminToken'); // Adjust based on your token storage
  };

  const categories = ["Spiritual Growth", "Education", "Prayer", "Theology", "Biography", "Devotional", "Other"];

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      const data = await response.json();
      setBooks(data.data?.books || data.data || []);
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

  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    description: "",
    category: "",
    coverImage: null as File | null,
    pdfFile: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login as admin to manage books",
          variant: "destructive",
        });
        return;
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('authorName', formData.authorName);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }
      
      if (formData.pdfFile) {
        submitData.append('pdfFile', formData.pdfFile);
      }

      let response;
      const url = editingBook ? `${API_BASE_URL}/books/${editingBook._id}` : `${API_BASE_URL}/books`;
      
      response = await fetch(url, {
        method: editingBook ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${editingBook ? 'update' : 'create'} book`);
      }

      await fetchBooks(); // Refresh the list
      toast({ 
        title: `Book ${editingBook ? 'updated' : 'uploaded'} successfully` 
      });
      resetForm();
    } catch (error: any) {
      console.error('Error saving book:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingBook ? 'update' : 'upload'} book`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book: BookItem) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      authorName: book.authorName,
      description: book.description,
      category: book.category,
      coverImage: null,
      pdfFile: null,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please login as admin to delete books",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks(books.filter((b) => b._id !== id));
      toast({ 
        title: "Book deleted successfully",
        variant: "destructive" 
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (bookId: string, bookTitle: string) => {
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

      toast({ title: "Download started" });
    } catch (error) {
      console.error('Error downloading book:', error);
      toast({
        title: "Error",
        description: "Failed to download book",
        variant: "destructive",
      });
    }
  };

  const getCoverImageUrl = (book: BookItem) => {
    if (book.coverImage?.filename) {
      return `${API_BASE_URL}/books/${book._id}/cover`;
    }
    return null;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      authorName: "",
      description: "",
      category: "",
      coverImage: null,
      pdfFile: null,
    });
    setEditingBook(null);
    setIsAddDialogOpen(false);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Book Management</h1>
          <p className="text-muted-foreground">Upload and manage books and publications</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>All Books</CardTitle>
                <CardDescription>
                  Manage PDF books and publications ({books.length} books)
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Book
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingBook ? "Edit Book" : "Upload New Book"}</DialogTitle>
                    <DialogDescription>
                      {editingBook ? "Update book information" : "Add a new book or publication"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorName">Author Name *</Label>
                      <Input
                        id="authorName"
                        value={formData.authorName}
                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="coverImage">Cover Image (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, coverImage: file });
                            }
                          }}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {editingBook && editingBook.coverImage ? 
                          `Current: ${editingBook.coverImage.filename}` : 
                          'Upload a cover image for the book'
                        }
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="pdfFile">PDF File *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="pdfFile"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, pdfFile: file });
                            }
                          }}
                          required={!editingBook}
                        />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {editingBook && editingBook.pdfFile ? 
                          `Current: ${editingBook.pdfFile.filename} (${formatFileSize(editingBook.pdfFile.size)})` : 
                          'Upload the PDF file for the book'
                        }
                      </p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!formData.pdfFile && !editingBook}>
                        {editingBook ? "Update Book" : "Upload Book"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search books by title, author, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? 'No books found matching your search.' : 'No books available yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Card key={book._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getCoverImageUrl(book) ? (
                            <img 
                              src={getCoverImageUrl(book)!} 
                              alt={book.title}
                              className="h-8 w-8 object-cover rounded"
                            />
                          ) : (
                            <Book className="h-8 w-8 text-primary" />
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDownload(book._id, book.title)}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(book)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(book._id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2 line-clamp-2">{book.title}</CardTitle>
                      <CardDescription>by {book.authorName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {book.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span className="px-2 py-1 rounded-full bg-muted">{book.category}</span>
                        <span>{book.numberOfDownloads || 0} downloads</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Added: {formatDate(book.createdAt)}
                      </div>
                      {book.pdfFile && (
                        <div className="text-xs text-muted-foreground mt-1">
                          PDF: {formatFileSize(book.pdfFile.size)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookManagement;