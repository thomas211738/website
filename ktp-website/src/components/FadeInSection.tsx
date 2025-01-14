// FadeInSection.tsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '@mui/material';

interface FadeInSectionProps {
  children: React.ReactNode;
  threshold?: number | number[];
  triggerOnce?: boolean;
  // You can add more props for controlling the animation, like direction, delay, etc.
}

export function FadeInSection({
  children,
  threshold = 0.1,
  triggerOnce = true,
}: FadeInSectionProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(50px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      {children}
    </Box>
  );
}
