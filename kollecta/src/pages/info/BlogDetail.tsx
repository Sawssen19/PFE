import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBlogPostById } from './blogData';
import InfoPageLayout from './InfoPageLayout';
import './InfoPageLayout.css';
import './BlogDetail.css';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getBlogPostById(parseInt(id)) : null;

  if (!post) {
    return (
      <InfoPageLayout
        heroTitle="Article non trouvé"
        heroSubtitle="L'article que vous recherchez n'existe pas"
        gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
      >
        <div className="info-section">
          <button 
            className="info-cta-button"
            onClick={() => navigate('/blog')}
            style={{ marginTop: '20px' }}
          >
            Retour au blog
          </button>
        </div>
      </InfoPageLayout>
    );
  }

  return (
    <InfoPageLayout
      heroTitle={post.title}
      heroSubtitle={post.excerpt}
      gradient="linear-gradient(135deg, #00b289 0%, #00a07a 100%)"
    >
      <div className="blog-detail-container">
        <div className="blog-detail-header">
          <button 
            className="blog-back-button"
            onClick={() => navigate('/blog')}
          >
            ← Retour au blog
          </button>
          
          <div className="blog-meta">
            <div className="blog-meta-item">
              <span className="blog-meta-icon">{post.icon}</span>
              <span className="blog-meta-category">{post.category}</span>
            </div>
            <div className="blog-meta-item">
              <span className="blog-meta-date">{post.date}</span>
              <span className="blog-meta-readtime">{post.readTime} de lecture</span>
            </div>
            {post.author && (
              <div className="blog-meta-item">
                <span className="blog-meta-author">Par {post.author}</span>
              </div>
            )}
          </div>
        </div>

        <div className="blog-detail-content">
          <div 
            className="blog-content-html"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="blog-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="blog-tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="blog-detail-cta">
          <h3>Cet article vous a inspiré ?</h3>
          <p>Lancez votre propre collecte de fonds sur Kollecta</p>
          <button 
            className="info-cta-button"
            onClick={() => navigate('/create/fundraiser?new=true')}
          >
            Créer ma cagnotte
          </button>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default BlogDetail;


