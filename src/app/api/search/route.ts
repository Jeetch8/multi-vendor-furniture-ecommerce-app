import { searchProducts } from '@/lib/services/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('searchQuery');
  if (!query) {
    return Response.json({ message: 'No query provided' }, { status: 400 });
  }
  const res = await searchProducts(query);
  return Response.json(res);
}
