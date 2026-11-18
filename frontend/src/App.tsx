import { useEffect, useState, type FormEvent } from 'react';

type Category = {
  id: number;
  name: string;
  createdAt: string;
};

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: Category[]) => setCategories(data))
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(
        Array.isArray(body.message) ? body.message.join(', ') : body.message,
      );
      return;
    }

    const created: Category = await res.json();
    setCategories((prev) => [...prev, created]);
    setName('');
  }

  return (
    <main>
      <h1>snipfield</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New category"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p>Error: {error}</p>}

      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;