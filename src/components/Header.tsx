import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

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
          {user?.role === 'student' && (
            <NavLink
              to="/student"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeClassName="text-primary"
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'student' && (
                  <>
                    <DropdownMenuItem asChild>
                      <NavLink to="/student" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <NavLink to="/student/materials" className="w-full cursor-pointer">
                        Learning Materials
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <NavLink to="/student/assignments" className="w-full cursor-pointer">
                        Assignments
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <NavLink to="/student/zoom-schedule" className="w-full cursor-pointer">
                        Zoom Schedule
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <NavLink to="/login">Sign In</NavLink>
              </Button>
              <Button asChild className="bg-gradient-primary">
                <NavLink to="/register">Get Started</NavLink>
              </Button>
            </>
          )}
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
          {user?.role === 'student' && (
            <>
              <NavLink
                to="/student"
                className="block py-2 text-sm font-medium hover:text-primary"
                activeClassName="text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/student/materials"
                className="block py-2 text-sm font-medium hover:text-primary"
                activeClassName="text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Learning Materials
              </NavLink>
              <NavLink
                to="/student/assignments"
                className="block py-2 text-sm font-medium hover:text-primary"
                activeClassName="text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Assignments
              </NavLink>
              <NavLink
                to="/student/zoom-schedule"
                className="block py-2 text-sm font-medium hover:text-primary"
                activeClassName="text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Zoom Schedule
              </NavLink>
            </>
          )}
          
          <div className="pt-3 space-y-2 border-t">
            {user ? (
              <div className="space-y-3">
                <div className="px-2 py-1 text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-muted-foreground text-xs capitalize">{user.role}</p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <NavLink to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </NavLink>
                </Button>
                <Button variant="destructive" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </NavLink>
                </Button>
                <Button className="w-full bg-gradient-primary" asChild>
                  <NavLink to="/register" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </NavLink>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;