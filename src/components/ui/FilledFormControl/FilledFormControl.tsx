import { FormControl } from '@mui/material';

const FilledFormControl = ({ children }: { children: React.ReactNode }) => {
  return (
    <FormControl
      fullWidth
      variant='filled'
      sx={{
        '& .MuiFilledInput-root': {
          backgroundColor: 'rgba(53, 27, 27, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '2px solid #667eea',
            boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.2)',
          },
          '&:before, &:after': {
            display: 'none',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255, 255, 255, 0.9)',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#667eea',
          },
        },
        '& .MuiFilledInput-input': {
          color: 'white',
          padding: '30px 16px 8px',
        },
      }}>
      {children}
    </FormControl>
  );
};

export default FilledFormControl;
