export default function Card({ as: Tag = 'article', className = '', children, ...props }) {
  return <Tag className={`card ${className}`.trim()} {...props}>{children}</Tag>;
}
