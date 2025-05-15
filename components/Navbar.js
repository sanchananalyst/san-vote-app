import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar({ active = '' }) {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > 100) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScroll(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  const navClass = [
    show ? 'translate-y-0' : '-translate-y-full',
    'fixed top-0 w-full z-50 transition-transform duration-300',
    'backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm',
    'flex justify-center space-x-6 py-4 text-sm font-semibold text-gray-700'
  ].join(' ');

  const linkClass = (key) =>
    `${active === key ? 'underline' : 'hover:underline'} flex items-center gap-1`;

  return (
    <nav className={navClass}>
      <Link href="/" className={linkClass('home')}>
        <span>🏠</span> <span>Home</span>
      </Link>
      <Link href="/top" className={linkClass('top')}>
        <span>🔝</span> <span>Top Designs</span>
      </Link>
      <Link href="/all" className={linkClass('all')}>
        <span>🖼</span> <span>All Designs</span>
      </Link>
      <a
        href="https://sanchankantaro.myshopify.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-pink-600 flex items-center gap-1"
      >
        <span>🛍</span> <span>Merch Store</span>
      </a>
    </nav>
  );
}
