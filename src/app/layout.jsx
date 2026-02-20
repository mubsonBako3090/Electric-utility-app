import "../styles/globals.css";

export const metadata = {
  title: "Rigyasa Electric Billing System",
  description: "Eliminating Estimated Billing via BEA Model",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
