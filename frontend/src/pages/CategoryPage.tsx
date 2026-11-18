import { Link, useParams } from 'react-router';

function CategoryPage() {
  const { id } = useParams();

  return (
    <main>
      <Link to="/">← All categories</Link>
      <h1>Category {id}</h1>
    </main>
  );
}

export default CategoryPage;