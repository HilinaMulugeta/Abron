import React from "react";
import Hero from "../components/Hero";
import EnhancedProductList from "../components/EnhancedProductList";
import MobileAppShell from "../components/MobileAppShell";
import ErrorBoundary from "../components/ErrorBoundary";

function EnhancedHomePage() {
  return (
    <ErrorBoundary>
      <MobileAppShell>
        <div className="customer-page home-page">
          <Hero />
          <EnhancedProductList />
        </div>
      </MobileAppShell>
    </ErrorBoundary>
  );
}

export default EnhancedHomePage;