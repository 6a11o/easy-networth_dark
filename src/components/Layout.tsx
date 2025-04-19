import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

// CSS for the cosmic background animation
const cosmicBackgroundStyles = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  .cosmic-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-color: #080c1a;
    overflow: hidden;
  }

  .cosmic-background::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(1px 1px at 25% 15%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1px 1px at 75% 35%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 30% 55%, rgba(255, 255, 255, 0.4), transparent),
      radial-gradient(2px 2px at 60% 75%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(1px 1px at 90% 85%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(2px 2px at 15% 70%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1px 1px at 40% 90%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(1.5px 1.5px at 10% 40%, rgba(255, 255, 255, 0.3), transparent),
      /* Extended star field to improve coverage */
      radial-gradient(1px 1px at 85% 10%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1.5px 1.5px at 20% 20%, rgba(255, 255, 255, 0.25), transparent),
      radial-gradient(1px 1px at 65% 40%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1.5px 1.5px at 35% 65%, rgba(255, 255, 255, 0.25), transparent),
      radial-gradient(1px 1px at 80% 30%, rgba(255, 255, 255, 0.3), transparent),
      /* Enhanced background gradient with more uniform coverage */
      linear-gradient(170deg, hsl(240, 50%, 5%) 0%, hsl(230, 45%, 10%) 40%, hsl(220, 40%, 15%) 80%, hsl(240, 40%, 10%) 100%);
  }

  .cosmic-background::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      /* Enhanced glow effects covering more area */
      radial-gradient(circle at 20% 30%, rgba(51, 195, 240, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 80% 70%, rgba(102, 234, 206, 0.1) 0%, transparent 30%),
      radial-gradient(circle at 50% 50%, rgba(155, 135, 245, 0.05) 0%, transparent 40%);
  }

  /* Create twinkling stars */
  .star {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 0 3px 1px rgba(255, 255, 255, 0.4);
    animation: twinkle ease infinite;
  }

  /* Generate 60 stars with better distribution across the entire viewport */
  ${Array(60).fill(0).map((_, i) => `
    .star:nth-child(${i + 1}) {
      top: ${Math.random() * 100}vh;
      left: ${Math.random() * 100}vw;
      width: ${Math.random() * 2 + 1}px;
      height: ${Math.random() * 2 + 1}px;
      opacity: ${Math.random() * 0.7 + 0.3};
      animation-duration: ${Math.random() * 5 + 3}s;
      animation-delay: ${Math.random() * 5}s;
    }
  `).join('')}
`;

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const Layout = ({ children, requireAuth = true }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  // Inject the cosmic background styles
  return (
    <>
      <style>{cosmicBackgroundStyles}</style>
      
      <div className="cosmic-background">
        {/* Generate twinkling stars */}
        {Array(60).fill(0).map((_, i) => (
          <div key={i} className="star"></div>
        ))}
      </div>
      
      {requireAuth && !isAuthenticated ? (
        <Navigate to="/login" replace />
      ) : !requireAuth ? (
        // For Landing Page and Auth pages (login/signup)
        <div className="min-h-screen w-full relative">
          {children}
        </div>
      ) : (
        // Dashboard layout
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden relative">
          {/* Enhanced colored light blobs for depth */}
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#33C3F0]/8 blur-[180px] rounded-full z-0"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#9b87f5]/8 blur-[180px] rounded-full z-0"></div>
          <div className="absolute top-1/3 left-1/4 w-1/4 h-1/3 bg-[#66EACE]/8 blur-[150px] rounded-full z-0"></div>
          
          {/* Animated light elements */}
          <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-[#33C3F0]/5 rounded-full blur-[100px] animate-pulse z-0"></div>
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-[#9b87f5]/5 rounded-full blur-[120px] animate-pulse z-0" style={{animationDuration: '8s'}}></div>
          
          <TopBar />
          <div className="flex-1 overflow-auto pt-20 px-3 sm:px-5 md:px-6 lg:px-8 pb-6 sm:pb-8 relative z-10">
            <div className="max-w-screen-2xl mx-auto w-full">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
