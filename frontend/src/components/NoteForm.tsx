import { useState, type FormEvent } from "react";
import type { Item } from "../types";

type NoteFormProps = {
  categoryId: number;
  onCreated: (item: Item) => void;
};

function NoteForm({ categoryId, onCreated }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const res = await fetch(`/api/categories/${categoryId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(
        Array.isArray(body.message) ? body.message.join(", ") : body.message,
      );
      return;
    }

    const created: Item = await res.json();
    onCreated(created);
    setTitle('');
    setContent('');
    
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Title (optional)"
      />

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Paste or write your note"
      />
      <button type="submit">Add note</button>
      {error && <p>Error: {error}</p>}
    </form>
  );
}

export default NoteForm;
