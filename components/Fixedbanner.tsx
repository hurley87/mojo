import Link from 'next/link';
import React from 'react';

const FixedBanner = ({ text, url }: { text: string; url: string }) => (
  <div
    style={{ zIndex: 99 }}
    className="fixed top-0 left-0 w-full bg-primary text-black text-center text-xs p-2"
  >
    <Link href={url} className="underline">
      {text}
    </Link>
  </div>
);

export default FixedBanner;
