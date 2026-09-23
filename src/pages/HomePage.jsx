import React from "react";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import MobileAppShell from "../components/MobileAppShell";
import { useTheme } from "../theme/ThemeContext";
import { getThemeClass } from "../theme/components";

function HomePage() {
  const { isDarkMode } = useTheme();
  const pageClasses = getThemeClass('page', 'base', isDarkMode);
  
  return (
    <MobileAppShell>
      <div className={`customer-page home-page ${pageClasses}`}>
        <Hero />
        <ProductList />
      </div>
    </MobileAppShell>
  );
}

export default HomePage;
