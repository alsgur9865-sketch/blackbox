import { FileText } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, description, actionLabel = '첫 진단 시작', actionTo = '/diagnosis' }) {
  return (
    <div className="empty-state">
      <div className="icon-box"><FileText /></div>
      <h2>{title}</h2>
      <p>{description}</p>
      <Button to={actionTo} size="lg">{actionLabel}</Button>
    </div>
  );
}
