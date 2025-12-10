import React from 'react';
import './InfoPageLayout.css';

interface InfoPageLayoutProps {
  children: React.ReactNode;
  heroTitle: string;
  heroSubtitle?: string;
  heroImage?: string;
  gradient?: string;
}

const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({
  children,
  heroTitle,
  heroSubtitle,
  heroImage,
  gradient = 'linear-gradient(135deg, #02AAB0 0%, #00CDAC 100%)'
}) => {
  return (
    <div className="info-page">
      {/* Hero Section */}
      <section className="info-hero" style={{ background: gradient }}>
        <div className="info-hero-content">
          <h1 className="info-hero-title">{heroTitle}</h1>
          {heroSubtitle && <p className="info-hero-subtitle">{heroSubtitle}</p>}
        </div>
        {heroImage && (
          <div className="info-hero-image">
            <img src={heroImage} alt={heroTitle} />
          </div>
        )}
      </section>

      {/* Main Content */}
      <main className="info-content">
        {children}
      </main>
    </div>
  );
};

export default InfoPageLayout;






