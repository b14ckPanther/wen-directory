'use client';

import React from 'react';
import * as icons from 'lucide-react';

type IconName = keyof typeof icons;

type DynamicIconProps = {
  name: string;
} & icons.LucideProps;

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  // Type assertion to ensure the name is a valid key
  const IconComponent = icons[name as IconName] as React.ElementType;

  if (!IconComponent) {
    // Fallback icon if the name is invalid or not found
    return <icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;