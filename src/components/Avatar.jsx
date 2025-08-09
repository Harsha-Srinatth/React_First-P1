import React, { useState } from 'react';

const Avatar = ({
  imageUrl,
  name = '',
  className = 'w-10 h-10',
  alt = 'Profile',
  onClick,
}) => {
  const [isBroken, setIsBroken] = useState(false);

  const initial = (name?.trim()?.charAt(0) || '?').toUpperCase();

  const commonClasses = 'rounded-full flex items-center justify-center select-none';
  const imageClasses = 'rounded-full object-cover';

  const showImage = Boolean(imageUrl) && !isBroken;

  return (
    <div
      className={`${className} ${commonClasses}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-label={alt}
    >
      {showImage ? (
        <img
          src={imageUrl}
          className={`${className} ${imageClasses}`}
          alt={alt}
          onError={() => setIsBroken(true)}
        />
      ) : (
        <div className={`${className} ${commonClasses} bg-gray-700 text-white font-semibold`}>{initial}</div>
      )}
    </div>
  );
};

export default Avatar;


