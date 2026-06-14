import React from 'react';

// Mentor Note:
// Even minimal components like the Footer should be isolated into their own files. 
// As the enterprise application grows, the footer might suddenly require complex 
// navigation menus, newsletter signup forms, or dynamic legal links. 
// Keeping it isolated ensures that adding these features won't bloat the Root Layout file.

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-neutral-500">
        <div>
          &copy; {currentYear} VARIO Enterprise. All rights reserved.
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
