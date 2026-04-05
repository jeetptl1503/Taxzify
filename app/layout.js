// app/layout.js
import './globals.css';
import { ThemeProvider } from './theme-provider';

export const metadata = {
  title: 'Taxzify — Discover Every Tax Benefit You Deserve',
  description:
    'Taxzify maps every deduction, rebate, and government subsidy you qualify for — personalized, simplified, and always up to date for Indian taxpayers.',
  keywords: [
    'tax savings',
    'Indian tax deductions',
    'tax regime comparison',
    'government subsidies India',
    'tax benefits',
    '80C deduction',
    'tax optimization',
  ],
  openGraph: {
    title: 'Taxzify — Discover Every Tax Benefit You Deserve',
    description:
      'Stop leaving tax benefits on the table. Taxzify helps Indian taxpayers discover every deduction, rebate, and subsidy they qualify for.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
