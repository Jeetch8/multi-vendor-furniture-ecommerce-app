import { fetchProductsForList } from '@/lib/services/product';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  try {
    const products = await fetchProductsForList({
      ...searchParamsObj,
    });
    if (!products) {
      return Response.json({ message: 'Products not found' }, { status: 404 });
    }
    return Response.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ message: 'Products not found' }, { status: 404 });
  }
}
