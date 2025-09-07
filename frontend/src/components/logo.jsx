export function Logo({className = '', size = 'md'}) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`${sizes[size]} font-bold text-gray-800`}>
          <span className="inline-block transform rotate-45 text-blue-600">S</span>
        </div>
      </div>
      <span className={`${sizes[size]} font-semibold text-gray-800`}>
        Sprint<span className="text-blue-600">Sync</span>
      </span>
    </div>
  );
}
