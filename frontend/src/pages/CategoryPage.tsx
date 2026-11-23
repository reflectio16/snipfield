import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { CategoryWithItems, Item } from '../types';
import NoteForm from '../components/NoteForm';
import ImageForm from '../components/ImageForm';
import ItemCard from '../components/ItemCard';

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<CategoryWithItems | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/categories/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.message);
        }
        return res.json();
      })
      .then((data: CategoryWithItems) => setCategory(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function addItem(item: Item) {
    setCategory((prev) =>
      prev ? { ...prev, items: [item, ...prev.items] } : prev,
    );
  }

  if (loading) {
    return <p>Loading…</p>;
  }

  if (error || !category) {
    return (
      <main>
        <Link to="/">← All categories</Link>
        <p>Error: {error}</p>
      </main>
    );
  }

  function removeItem(id: number) {
    setCategory((prev) =>
      prev 
        ? { ...prev, items: prev.items.filter((item) => item.id !== id) } 
        : prev);
  }

  return (
    <main>
      <Link to="/">← All categories</Link>
      <h1>{category.name}</h1>

      <NoteForm categoryId={category.id} onCreated={addItem} />
      <ImageForm categoryId={category.id} onCreated={addItem} />

      {category.items.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {category.items.map((item) => (
            <li key={item.id}>
              <ItemCard item={item} onDeleted={removeItem} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default CategoryPage;