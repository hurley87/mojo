import React from 'react';

const FixedBanner = () => (
  <div
    style={{ zIndex: 9999 }}
    className="fixed top-0 left-0 w-full bg-primary text-black text-center text-xs p-2"
  >
    <a
      target="_blank"
      href="https://discord.gg/MjT8ZAZtw4"
      className="underline"
    >
      Click here to join our Discord! Get get access to our community and
      product updates.
    </a>
  </div>
);

export default FixedBanner;
