import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  container?: boolean;
  extraPadding?: boolean;
  maxWidth?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '', 
  container = true,
  extraPadding = false,
  maxWidth = '1200px'
}) => {
  const containerClass = container ? 'page-container' : '';
  const paddingClass = extraPadding ? 'extra-padding' : '';
  const combinedClass = `${containerClass} ${paddingClass} ${className}`.trim();

  return (
    <div 
      className={combinedClass}
      style={container ? { maxWidth } : {}}
    >
      {children}
    </div>
  );
};

export default PageLayout;
