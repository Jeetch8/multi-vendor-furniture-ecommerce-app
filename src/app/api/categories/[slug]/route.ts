import { auth } from '@/lib/auth';
import { fetchCategoryBySlug } from '@/lib/services/category';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    );
  }

  const session = await auth();

  if (!session || !session.user || !session.user.id || !session.user.store) {
    return Response.json(
      { message: 'You dont have permission to do that.' },
      { status: 401 }
    );
  }

  try {
    const categoryQuery = await db.query.categories.findFirst({
      where: eq(schema.categories.slug, slug),
      with: {
        subCategories: {
          with: {
            products: {
              columns: {
                id: true,
              },
            },
          },
        },
        products: {
          columns: {
            id: true,
          },
        },
      },
    });
    if (categoryQuery) {
      return Response.json({
        id: categoryQuery.id,
        name: categoryQuery.name,
        slug: categoryQuery.slug,
        sub_categories: categoryQuery.subCategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          slug: sub.slug,
          productCount: sub.products.length,
        })),
      });
    } else {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    return Response.json({ error: 'Internal Server ErrorA' }, { status: 500 });
  }
}
