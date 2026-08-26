import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { MasjidProvider } from '@/context/MasjidContext';
import ThemeBodyWrapper from '@/components/ThemeBodyWrapper';

export const metadata = {
  title: 'Kingdom of Allah',
  description: 'A platform for Islamic resources and community engagement.',
  icons: {
    icon: '/logos/KOA Logos/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider>
        <MasjidProvider>
          <ThemeBodyWrapper>{children}</ThemeBodyWrapper>
        </MasjidProvider>
      </ThemeProvider>
    </html>
  );
}