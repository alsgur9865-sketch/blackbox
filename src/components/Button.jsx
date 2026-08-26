import { Link } from 'react-router-dom';

export default function Button({ to, children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const classes = [
    'button',
    variant === 'ghost' ? 'button-ghost' : '',
    size === 'lg' ? 'button-lg' : size === 'sm' ? 'button-sm' : '',
    className
  ].filter(Boolean).join(' ');

  if (to) return <Link to={to} className={classes} {...props}>{children}</Link>;
  return <button type={type} className={classes} {...props}>{children}</button>;
}
