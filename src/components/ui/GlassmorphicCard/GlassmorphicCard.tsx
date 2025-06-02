import {
  Card as MuiCard,
  type CardProps,
  type SxProps,
  type Theme,
} from '@mui/material';
import { motion } from 'framer-motion';

type GlassmorphicCardProps = React.PropsWithChildren<{
  styleVariant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'minimal'
    | 'bold';
  size?: 'small' | 'medium' | 'large';
  hover?: boolean;
  sx?: SxProps<Theme>;
  transition?: { delay: number };
}> &
  CardProps;

const GlassmorphicCard = ({
  children,
  styleVariant = 'default',
  size = 'medium',
  hover = true,
  sx = {},
  transition,
  ...props
}: GlassmorphicCardProps) => {
  const baseStyles = {
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const hoverStyles = hover
    ? {
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
        },
      }
    : {};

  const sizeStyles = {
    small: {
      padding: '24px',
      borderRadius: '16px',
    },
    medium: {
      padding: '48px',
      borderRadius: '24px',
    },
    large: {
      padding: '64px',
      borderRadius: '32px',
    },
  };

  const variantStyles = {
    default: {},
    primary: {
      background:
        'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)',
      border: '2px solid rgba(102, 126, 234, 0.3)',
      '&:hover': hover
        ? {
            border: '2px solid rgba(102, 126, 234, 0.5)',
            boxShadow: '0 35px 60px -12px rgba(102, 126, 234, 0.2)',
          }
        : {},
    },
    secondary: {
      background:
        'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.15) 100%)',
      border: '2px solid rgba(168, 85, 247, 0.3)',
      '&:hover': hover
        ? {
            border: '2px solid rgba(168, 85, 247, 0.5)',
            boxShadow: '0 35px 60px -12px rgba(168, 85, 247, 0.2)',
          }
        : {},
    },
    success: {
      background:
        'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(21, 128, 61, 0.15) 100%)',
      border: '2px solid rgba(34, 197, 94, 0.3)',
      '&:hover': hover
        ? {
            border: '2px solid rgba(34, 197, 94, 0.5)',
            boxShadow: '0 35px 60px -12px rgba(34, 197, 94, 0.2)',
          }
        : {},
    },
    warning: {
      background:
        'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
      border: '2px solid rgba(251, 191, 36, 0.3)',
      '&:hover': hover
        ? {
            border: '2px solid rgba(251, 191, 36, 0.5)',
            boxShadow: '0 35px 60px -12px rgba(251, 191, 36, 0.2)',
          }
        : {},
    },
    error: {
      background:
        'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
      border: '2px solid rgba(239, 68, 68, 0.3)',
      '&:hover': hover
        ? {
            border: '2px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 35px 60px -12px rgba(239, 68, 68, 0.2)',
          }
        : {},
    },
    minimal: {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
      '&:hover': hover
        ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 35px -8px rgba(0, 0, 0, 0.2)',
          }
        : {},
    },
    bold: {
      background:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
      border: '3px solid rgba(255, 255, 255, 0.4)',
      boxShadow: '0 35px 65px -15px rgba(0, 0, 0, 0.35)',
      '&:hover': hover
        ? {
            transform: 'translateY(-12px)',
            boxShadow: '0 45px 80px -15px rgba(0, 0, 0, 0.4)',
            border: '3px solid rgba(255, 255, 255, 0.6)',
          }
        : {},
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[styleVariant],
    ...hoverStyles,
    ...sx,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={transition}>
      <MuiCard
        sx={combinedStyles as SxProps<Theme>}
        {...props}>
        {children}
      </MuiCard>
    </motion.div>
  );
};

export default GlassmorphicCard;
