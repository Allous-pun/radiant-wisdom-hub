import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Teacher of Excellence</h3>
            <p className="text-sm text-muted-foreground">
              Sharing spiritual wisdom and educational excellence through the ministry of Eugene Kololi Choge.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About Eugene
                </Link>
              </li>
              <li>
                <Link to="/sermons" className="hover:text-primary transition-colors">
                  Sermons
                </Link>
              </li>
              <li>
                <Link to="/prayers" className="hover:text-primary transition-colors">
                  Prayers
                </Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-primary transition-colors">
                  Books
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground mb-2">
              For speaking engagements or spiritual guidance.
            </p>
            <Link to="/contact" className="text-sm text-primary hover:underline">
              Get in Touch
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
          <span>© 2024 Teacher of Excellence. Made with</span>
          <Heart className="h-4 w-4 text-secondary fill-secondary" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;