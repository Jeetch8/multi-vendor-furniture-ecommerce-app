import { TCategoryForSidebar } from '@/types/Category';
import img1 from '../../public/furniture-environment/image1.webp';
import img2 from '../../public/furniture-environment/image2.webp';
import img3 from '../../public/furniture-environment/image3.webp';
import img4 from '../../public/furniture-environment/image4.webp';
import img5 from '../../public/furniture-environment/image5.webp';
import { TCollection } from '@/lib/schema';

export const navbarCategories = [
  {
    name: 'Sofas',
    slug: 'sofas',
    subCategories: [
      { name: '2 Seater Sofa', slug: '2-seater-sofa' },
      { name: '3 Seater Sofa', slug: '3-seater-sofa' },
      { name: 'Corner Sofa', slug: 'corner-sofa' },
      { name: 'Sofa Bed', slug: 'sofa-bed' },
      { name: 'Recliner Sofa', slug: 'recliner-sofa' },
      { name: 'Modular Sofa', slug: 'modular-sofa' },
    ],
  },
  {
    name: 'Beds',
    slug: 'beds',
    subCategories: [
      { name: 'Single Bed', slug: 'single-bed' },
      { name: 'Double Bed', slug: 'double-bed' },
      { name: 'King Size Bed', slug: 'king-size-bed' },
      { name: 'Storage Bed', slug: 'storage-bed' },
      { name: 'Bunk Bed', slug: 'bunk-bed' },
      { name: 'Kids Bed', slug: 'kids-bed' },
    ],
  },
  {
    name: 'Tables',
    slug: 'tables',
    subCategories: [
      { name: 'Dining Table', slug: 'dining-table' },
      { name: 'Coffee Table', slug: 'coffee-table' },
      { name: 'Study Table', slug: 'study-table' },
      { name: 'Side Table', slug: 'side-table' },
      { name: 'Console Table', slug: 'console-table' },
      { name: 'Outdoor Table', slug: 'outdoor-table' },
    ],
  },
  {
    name: 'Seating',
    slug: 'seating',
    subCategories: [
      { name: 'Dining Chairs', slug: 'dining-chairs' },
      { name: 'Accent Chairs', slug: 'accent-chairs' },
      { name: 'Bar Stools', slug: 'bar-stools' },
      { name: 'Benches', slug: 'benches' },
      { name: 'Ottoman', slug: 'ottoman' },
      { name: 'Gaming Chairs', slug: 'gaming-chairs' },
    ],
  },
  {
    name: 'Storage',
    slug: 'storage',
    subCategories: [
      { name: 'Wardrobes', slug: 'wardrobes' },
      { name: 'Cabinets', slug: 'cabinets' },
      { name: 'Bookshelves', slug: 'bookshelves' },
      { name: 'TV Units', slug: 'tv-units' },
      { name: 'Shoe Racks', slug: 'shoe-racks' },
      { name: 'Display Units', slug: 'display-units' },
    ],
  },
  {
    name: 'Office',
    slug: 'office',
    subCategories: [
      { name: 'Office Desks', slug: 'office-desks' },
      { name: 'Office Chairs', slug: 'office-chairs' },
      { name: 'Filing Cabinets', slug: 'filing-cabinets' },
      { name: 'Bookcases', slug: 'bookcases' },
      { name: 'Meeting Tables', slug: 'meeting-tables' },
      { name: 'Reception Furniture', slug: 'reception-furniture' },
    ],
  },
  {
    name: 'Outdoor',
    slug: 'outdoor',
    subCategories: [
      { name: 'Garden Sets', slug: 'garden-sets' },
      { name: 'Outdoor Sofas', slug: 'outdoor-sofas' },
      { name: 'Patio Chairs', slug: 'patio-chairs' },
      { name: 'Sun Loungers', slug: 'sun-loungers' },
      { name: 'Outdoor Dining', slug: 'outdoor-dining' },
      { name: 'Garden Benches', slug: 'garden-benches' },
    ],
  },
  {
    name: 'Lighting',
    slug: 'lighting',
    subCategories: [
      { name: 'Ceiling Lights', slug: 'ceiling-lights' },
      { name: 'Table Lamps', slug: 'table-lamps' },
      { name: 'Floor Lamps', slug: 'floor-lamps' },
      { name: 'Wall Lights', slug: 'wall-lights' },
      { name: 'Outdoor Lights', slug: 'outdoor-lights' },
      { name: 'Smart Lighting', slug: 'smart-lighting' },
    ],
  },
  {
    name: 'Decor',
    slug: 'decor',
    subCategories: [
      { name: 'Mirrors', slug: 'mirrors' },
      { name: 'Wall Art', slug: 'wall-art' },
      { name: 'Vases', slug: 'vases' },
      { name: 'Cushions', slug: 'cushions' },
      { name: 'Rugs', slug: 'rugs' },
      { name: 'Curtains', slug: 'curtains' },
    ],
  },
  {
    name: 'Kids',
    slug: 'kids',
    subCategories: [
      { name: 'Kids Beds', slug: 'kids-beds' },
      { name: 'Study Sets', slug: 'study-sets' },
      { name: 'Storage Units', slug: 'storage-units' },
      { name: 'Play Tables', slug: 'play-tables' },
      { name: 'Kids Seating', slug: 'kids-seating' },
      { name: 'Nursery', slug: 'nursery' },
    ],
  },
] as unknown as TCategoryForSidebar[];

export const navbarCollections = [
  { name: 'Sofa Collections', slug: 'sofa-collections', image: img1 },
  { name: 'Bed Collections', slug: 'bed-collections', image: img2 },
  { name: 'Table Collections', slug: 'table-collections', image: img3 },
  { name: 'Seating Collections', slug: 'seating-collections', image: img4 },
  { name: 'Storage Collections', slug: 'storage-collections', image: img5 },
] as unknown as TCollection[];
