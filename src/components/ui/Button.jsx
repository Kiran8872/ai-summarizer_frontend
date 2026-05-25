const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  icon: Icon,
  iconRight: IconRight,
  ...props
}) {
  return (
    <button
      type="button"
      className={`${variants[variant]} ${sizes[size]} gap-2 ${className}`}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
      {IconRight && <IconRight className="h-4 w-4" />}
    </button>
  );
}
