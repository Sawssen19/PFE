import React from 'react';

interface ActionIconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'edit' | 'delete' | 'primary' | 'secondary';
  title: string;
  ariaLabel: string;
  className?: string;
}

const ActionIconButton: React.FC<ActionIconButtonProps> = ({
  icon,
  onClick,
  variant,
  title,
  ariaLabel,
  className = ''
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'edit':
        return 'edit-icon-btn';
      case 'delete':
        return 'delete-icon-btn';
      case 'primary':
        return 'primary-icon-btn';
      case 'secondary':
        return 'secondary-icon-btn';
      default:
        return 'primary-icon-btn';
    }
  };

  return (
    <button
      className={`icon-action-btn ${getVariantClass()} ${className}`}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      type="button"
    >
      {icon}
    </button>
  );
};

export default ActionIconButton;
