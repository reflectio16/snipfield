import { useState, type ClipboardEvent, type FormEvent } from 'react';
import type { Item } from "../types";
import { htmlToMarkdown } from '../lib/htmlToMarkdown';

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

  function handlePaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const html = event.clipboardData.getData('text/html');
    if (!html) {
      return;
    }

    event.preventDefault();
    const markdown = htmlToMarkdown(html);

    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setContent(content.slice(0, start) + markdown + content.slice(end));
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
        onPaste={handlePaste}
        placeholder="Paste or write your note"
      />
      <button type="submit">Add note</button>
      {error && <p>Error: {error}</p>}
    </form>
  );
}

export default NoteForm;
