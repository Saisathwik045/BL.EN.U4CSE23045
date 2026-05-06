"use client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Navbar from "@/components/Navbar";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5" },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
