import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Item } from '../types';
import { useState } from 'react';

type ItemCardProps = {
    item : Item;
    onDeleted: (id: number) => void;
};

function ItemCard({ item, onDeleted }: ItemCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Delete this item?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 404) {
        window.alert('Could not delete this item.');
        return;
      }
      onDeleted(item.id);
    } catch {
      window.alert('Could not delete this item. Check your connection.');
    } finally {
      setDeleting(false);
    }
  }

const content =
    item.type === 'IMAGE' ? (
      <img
        src={`/api/items/${item.id}/image`}
        alt={item.title ?? 'Saved image'}
        loading="lazy"
        style={{ maxWidth: '100%' }}
      />
    ) : (
      <>
        {item.title && <strong>{item.title}</strong>}
        <Markdown remarkPlugins={[remarkGfm]}>{item.content ?? ''}</Markdown>
      </>
    );

  return (
    <>
      {content}
      <button type="button" onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting…' : 'Delete'}
      </button>
    </>
  );
}

export default ItemCard;