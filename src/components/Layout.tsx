import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
// import { useAuth } from "@/contexts/AuthContext"; // Comment out for now

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // const { isLoading } = useAuth(); // Comment out for now

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;