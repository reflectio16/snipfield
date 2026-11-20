import { useState, type FormEvent } from 'react';
import type { Item } from '../types';

type ImageFormProps = {
    categoryId: number;
    onCreated: (item: Item) => void;
};

function ImageForm({ categoryId, onCreated }: ImageFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      return;
    }

    const form = event.currentTarget;
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/categories/${categoryId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        setError(
          Array.isArray(body.message) ? body.message.join(', ') : body.message,
        );
        return;
      }

      onCreated(await res.json());
      setFile(null);
      form.reset();
    } catch {
      setError('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
      />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading…' : 'Add image'}
      </button>
      {error && <p>Error: {error}</p>}
    </form>
  );
}

export default ImageForm;