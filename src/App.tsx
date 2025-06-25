import AppLayout from './components/AppLayout/AppLayout';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme">
      <AppLayout />
    </ThemeProvider>
  );
}

export default App;
