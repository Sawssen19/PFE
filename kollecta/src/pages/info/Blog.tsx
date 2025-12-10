import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoPageLayout from './InfoPageLayout';
import { blogPosts, getBlogPostsByCategory } from './blogData';
import './InfoPageLayout.css';
import './Blog.css';

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const filteredPosts = getBlogPostsByCategory(selectedCategory);

  const categories = [
    { name: "Tous", count: blogPosts.length },
    { name: "Conseils", count: blogPosts.filter(p => p.category === "Conseils").length },
    { name: "Guide", count: blogPosts.filter(p => p.category === "Guide").length },
    { name: "Marketing", count: blogPosts.filter(p => p.category === "Marketing").length },
    { name: "Événements", count: blogPosts.filter(p => p.category === "Événements").length },
    { name: "Communication", count: blogPosts.filter(p => p.category === "Communication").length },
    { name: "Inspiration", count: blogPosts.filter(p => p.category === "Inspiration").length }
  ];

  return (
    <InfoPageLayout
      heroTitle="Blog Kollecta"
      heroSubtitle="Ressources, conseils et histoires inspirantes pour réussir votre collecte de fonds"
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="info-section">
        <div className="blog-categories">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`blog-category-button ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        <div className="info-grid">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="info-card blog-card" 
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="blog-card-icon">{post.icon}</div>
              <div className="blog-card-category">{post.category}</div>
              <h3 className="info-card-title">{post.title}</h3>
              <p className="info-card-description">{post.excerpt}</p>
              <div className="blog-card-footer">
                <span>{post.date}</span>
                <span>{post.readTime} de lecture</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Abonnez-vous à notre newsletter</h2>
        <p className="info-section-text">
          Recevez chaque semaine nos meilleurs conseils, études de cas et actualités 
          directement dans votre boîte mail.
        </p>
        <div className="blog-newsletter">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="blog-newsletter-input"
          />
          <button className="blog-newsletter-button">
            S'abonner
          </button>
        </div>
      </div>

      <div className="info-cta">
        <h2 className="info-cta-title">Inspiré ? Passez à l'action !</h2>
        <p className="info-cta-text">
          Transformez vos idées en réalité avec Kollecta
        </p>
        <button 
          className="info-cta-button"
          onClick={() => navigate('/create/fundraiser?new=true')}
        >
          Créer ma cagnotte
        </button>
      </div>
    </InfoPageLayout>
  );
};

export default Blog;





