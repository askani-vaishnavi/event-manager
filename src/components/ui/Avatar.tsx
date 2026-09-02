interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fallback?: string;
  ring?: boolean;
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

export function Avatar({ src, alt = '', size = 'md', fallback, ring = false, className = '' }: AvatarProps) {
  const ringCls = ring ? 'ring-2 ring-white dark:ring-ink-900' : '';
  return (
    <div className={`${sizes[size]} ${ringCls} rounded-full overflow-hidden flex items-center justify-center font-semibold bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span>{fallback ?? alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: string[];
  count?: number;
  size?: 'xs' | 'sm' | 'md';
}

export function AvatarGroup({ avatars, count, size = 'sm' }: AvatarGroupProps) {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2.5">
        {avatars.map((src, i) => (
          <Avatar key={i} src={src} size={size} ring />
        ))}
      </div>
      {count !== undefined && (
        <span className="ml-2 text-xs font-medium text-muted">
          {count.toLocaleString()} people are interested
        </span>
      )}
    </div>
  );
}
