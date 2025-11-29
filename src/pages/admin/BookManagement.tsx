import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Book, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookItem {
  id: number;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImage: string;
  pdfFile: string;
  uploadDate: string;
  downloads: number;
}

const BookManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);

  const [books, setBooks] = useState<BookItem[]>([
    {
      id: 1,
      title: "Walking in Divine Purpose",
      author: "Eugene Kololi Choge",
      description: "A comprehensive guide to discovering and living in your God-given purpose",
      category: "Spiritual Growth",
      coverImage: "/placeholder.svg",
      pdfFile: "divine-purpose.pdf",
      uploadDate: "2024-01-10",
      downloads: 245,
    },
    {
      id: 2,
      title: "The Teacher's Heart",
      author: "Eugene Kololi Choge",
      description: "Insights into effective Christian education and mentorship",
      category: "Education",
      coverImage: "/placeholder.svg",
      pdfFile: "teachers-heart.pdf",
      uploadDate: "2024-01-15",
      downloads: 189,
    },
    {
      id: 3,
      title: "Prayers That Transform",
      author: "Eugene Kololi Choge",
      description: "A collection of powerful prayers for various life situations",
      category: "Prayer",
      coverImage: "/placeholder.svg",
      pdfFile: "prayers-transform.pdf",
      uploadDate: "2024-01-20",
      downloads: 312,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    coverImage: "",
    pdfFile: "",
    uploadDate: new Date().toISOString().split("T")[0],
  });

  const categories = ["Spiritual Growth", "Education", "Prayer", "Theology", "Biography", "Devotional", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      setBooks(books.map((b) => (b.id === editingBook.id ? { ...formData, id: b.id, downloads: b.downloads } : b)));
      toast({ title: "Book updated successfully" });
    } else {
      const newBook = { ...formData, id: books.length + 1, downloads: 0 };
      setBooks([...books, newBook]);
      toast({ title: "Book uploaded successfully" });
    }
    resetForm();
  };

  const handleEdit = (book: BookItem) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      category: book.category,
      coverImage: book.coverImage,
      pdfFile: book.pdfFile,
      uploadDate: book.uploadDate,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setBooks(books.filter((b) => b.id !== id));
    toast({ title: "Book deleted successfully", variant: "destructive" });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      category: "",
      coverImage: "",
      pdfFile: "",
      uploadDate: new Date().toISOString().split("T")[0],
    });
    setEditingBook(null);
    setIsAddDialogOpen(false);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <CardDescription>Manage PDF books and publications</CardDescription>
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
                      <Label htmlFor="title">Book Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
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
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="coverImage">Cover Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, coverImage: file.name });
                              toast({ title: "Cover image selected (mock upload)" });
                            }
                          }}
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Upload a cover image for the book</p>
                    </div>
                    <div>
                      <Label htmlFor="pdfFile">PDF File</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="pdfFile"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, pdfFile: file.name });
                              toast({ title: "PDF file selected (mock upload)" });
                            }
                          }}
                        />
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Upload the PDF file for the book</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingBook ? "Update" : "Upload"}</Button>
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
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Book className="h-8 w-8 text-primary" />
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(book)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{book.title}</CardTitle>
                    <CardDescription>by {book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{book.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-muted">{book.category}</span>
                      <span>{book.downloads} downloads</span>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Uploaded: {new Date(book.uploadDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookManagement;
