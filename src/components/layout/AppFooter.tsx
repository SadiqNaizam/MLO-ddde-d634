import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote } from 'lucide-react'; // Or any other relevant icon

const AppFooter: React.FC = () => {
  console.log('AppFooter loaded');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40 text-muted-foreground">
      <div className="container mx-auto py-8 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Banknote className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">FinDash</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 md:mb-0">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
          <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
        </nav>
        <div>
          <p className="text-center md:text-right">
            &copy; {currentYear} FinDash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;