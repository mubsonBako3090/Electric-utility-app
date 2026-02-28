// app/layout.jsx or app/page.jsx
import { useEffect } from 'react';

const Layout = ({ children }) => {
  useEffect(() => {
    // Example: Perform side effects like analytics, etc.
  }, []);

  return (
    <div>
      <header>My App Header</header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
