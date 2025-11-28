import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <NavLink to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Teacher of Excellence
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/"
            end
            className="text-sm font-medium transition-colors hover:text-primary"
            activeClassName="text-primary"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeClassName="text-primary"
          >
            About
          </NavLink>
          <NavLink
            to="/sermons"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeClassName="text-primary"
          >
            Sermons
          </NavLink>
          <NavLink
            to="/prayers"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeClassName="text-primary"
          >
            Prayers
          </NavLink>
          <NavLink
            to="/books"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeClassName="text-primary"
          >
            Books
          </NavLink>
          <NavLink
            to="/contact"
            className="text-sm font-medium transition-colors hover:text-primary"
            activeClassName="text-primary"
          >
            Contact
          </NavLink>
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" asChild>
            <NavLink to="/login">Sign In</NavLink>
          </Button>
          <Button asChild className="bg-gradient-primary">
            <NavLink to="/register">Get Started</NavLink>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-card px-4 py-4 space-y-3 animate-fade-in">
          <NavLink
            to="/"
            className="block py-2 text-sm font-medium hover:text-primary"
            activeClassName="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="block py-2 text-sm font-medium hover:text-primary"
            activeClassName="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/sermons"
            className="block py-2 text-sm font-medium hover:text-primary"
            activeClassName="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Sermons
          </NavLink>
          <NavLink
            to="/prayers"
            className="block py-2 text-sm font-medium hover:text-primary"
            activeClassName="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Prayers
          </NavLink>
          <NavLink
            to="/books"
            className="block py-2 text-sm font-medium hover:text-primary"
            activeClassName="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Books
          </NavLink>
          <NavLink
            to="/contact"
            className="block py-2 text-sm font-medium hover:text-primary"
            activeClassName="text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </NavLink>
          <div className="pt-3 space-y-2 border-t">
            <Button variant="outline" className="w-full" asChild>
              <NavLink to="/login">Sign In</NavLink>
            </Button>
            <Button className="w-full bg-gradient-primary" asChild>
              <NavLink to="/register">Get Started</NavLink>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
