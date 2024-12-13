import Button from '@mui/material/Button';
import { PaletteMode } from '@mui/material';

interface ThemeToggleProps {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
}

function ThemeToggle({ mode, setMode }: ThemeToggleProps) {
  return (
    <Button 
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </Button>
  );
}

export default ThemeToggle;