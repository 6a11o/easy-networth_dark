import React, { useState, useEffect } from 'react';
import { Wallet, LineChart, LayoutGrid, History, Repeat, Activity, Menu, X } from 'lucide-react'; // Added Menu and X icons
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Updated sections based on user request
const sections: Section[] = [
  { id: 'what-i-have', title: 'What I Have', icon: Wallet },
  { id: 'money-over-time', title: 'My Money Over Time', icon: LineChart },
  { id: 'where-i-have-it', title: 'Where I Have It', icon: LayoutGrid },
  { id: 'historical-data', title: 'Historical Data', icon: History },
  { id: 'money-habits', title: 'Money Habits', icon: Repeat },
  { id: 'what-i-did', title: 'What I Did', icon: Activity },
];

export const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const scrollToSection = (id: string) => {
    console.log(`Attempting to scroll to: #${id}`);
    
    // Close sheet if it's open
    if (isSheetOpen) {
      setIsSheetOpen(false);
    }
    
    // Wait for any React rendering to complete
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Calculate position accounting for fixed elements and add a buffer
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Scroll to the calculated position
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        console.log(`Scrolled to ${id} at position ${offsetPosition}`);
      } else {
        console.error(`Element #${id} not found in DOM`);
        
        // Debug: List all available IDs in the document for troubleshooting
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        console.log('Available element IDs:', allIds);
      }
    }, 0);
  };

  // Mobile menu trigger floating button
  const MobileTrigger = () => (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full flex items-center justify-center z-50 bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-[#131620] shadow-lg"
          size="icon"
          variant="secondary"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-[#131620]/95 border-t border-[#33C3F0]/20 pt-6 pb-10 rounded-t-xl">
        <div className="grid grid-cols-3 gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="flex flex-col items-center text-[#7A7F92] hover:text-[#66EACE] transition-colors duration-200 py-3"
            >
              <section.icon className="h-6 w-6 mb-2" />
              <span className="text-xs text-center">{section.title}</span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <aside className="fixed top-0 left-0 h-screen w-16 bg-[#131620]/50 backdrop-blur-md border-r border-[#33C3F0]/10 flex flex-col justify-center items-center py-20 z-40 space-y-10 hidden md:flex">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="flex flex-col items-center text-[#7A7F92] hover:text-[#66EACE] transition-colors duration-200 group"
          aria-label={`Scroll to ${section.title}`}
        >
          <section.icon className="h-6 w-6 mb-1 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {section.title}
          </span>
        </button>
      ))}
    </aside>
  );

  return (
    <>
      <DesktopSidebar />
      {isMobile && <MobileTrigger />}
    </>
  );
}; 