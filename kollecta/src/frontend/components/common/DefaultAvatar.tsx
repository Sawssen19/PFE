import React from 'react';

interface DefaultAvatarProps {
  size?: number;
  firstName?: string;
  lastName?: string;
}

const DefaultAvatar: React.FC<DefaultAvatarProps> = ({ 
  size = 120, 
  firstName = 'U', 
  lastName = 'S' 
}) => {
  const initials = `${firstName?.[0] || 'U'}${lastName?.[0] || 'S'}`;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle de fond avec dégradé */}
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b289" />
          <stop offset="100%" stopColor="#008e6d" />
        </linearGradient>
      </defs>
      
      {/* Cercle principal */}
      <circle
        cx="60"
        cy="60"
        r="58"
        fill="url(#avatarGradient)"
        stroke="#ffffff"
        strokeWidth="4"
      />
      
      {/* Icône utilisateur stylisée */}
      <g fill="#ffffff">
        {/* Tête */}
        <circle cx="60" cy="45" r="18" />
        
        {/* Corps */}
        <path d="M30 85 C30 65 90 65 90 85 L90 95 C90 100 85 105 80 105 L40 105 C35 105 30 100 30 95 Z" />
      </g>
      
      {/* Initiales au centre */}
      <text
        x="60"
        y="65"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize="24"
        fontWeight="600"
        fontFamily="Arial, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
};

export default DefaultAvatar; 