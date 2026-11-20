import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Item } from '../types';

type ItemCardProps = {
    item : Item;
};

function ItemCard({ item }: ItemCardProps) {
  if (item.type === 'IMAGE') {
    return (
      <img
        src={`/api/items/${item.id}/image`}
        alt={item.title ?? 'Saved image'}
        loading="lazy"
        style={{ maxWidth: '100%' }}
      />
    );
  }

  return (
    <>
      {item.title && <strong>{item.title}</strong>}
      <Markdown remarkPlugins={[remarkGfm]}>{item.content ?? ''}</Markdown>
    </>
  );
}

export default ItemCard;