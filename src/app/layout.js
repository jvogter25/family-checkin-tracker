import "./globals.css";
import { AuthProvider } from './AuthContext';

export const metadata = {
  title: "Family Check-In Tracker",
  description: "Track daily check-ins with family members",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}