import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Track 404 errors silently
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Pagina nu a fost găsită</p>
        <a href="/" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
          Întoarce-te Acasă
        </a>
      </div>
    </div>
  );
};

export default NotFound;
