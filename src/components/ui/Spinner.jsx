export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-10 w-10 border-4', lg: 'h-12 w-12 border-4' };
  return (
    <span
      className={`inline-block animate-spin rounded-full border-brand-200 border-t-brand-600 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
