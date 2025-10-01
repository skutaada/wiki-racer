import React from 'react';

interface KofiButtonProps {
  username: string;
  className?: string;
}

export const KofiButton: React.FC<KofiButtonProps> = ({
  username,
  className = ""
}) => {
  return (
    <a
      href={`https://ko-fi.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${className}`}
    >
      <img
        height="36"
        style={{ border: 0, height: '36px' }}
        src="https://storage.ko-fi.com/cdn/kofi1.png?v=3"
        alt="Buy Me a Coffee at ko-fi.com"
      />
    </a>
  );
};