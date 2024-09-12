import PieChart from '@/components/shared/ui/PieChart';
import { auth } from '@/lib/auth';
import { getTopSellingCategoriesByStore } from '@/lib/services/category';

const generateColor = (index: number) => {
  // const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const colors = ['#8056e6', '#d3d8f8', '#FFBB28', '#FF8042'];
  return colors[index % colors.length];
};

async function OrderPieChart() {
  const session = await auth();
  const user = session?.user;
  const categories = await getTopSellingCategoriesByStore(
    user?.store?.id || ''
  );

  const categoryColorMap: Record<string, string> = {};
  categories.forEach((category, index) => {
    categoryColorMap[category.categoryId] = generateColor(index);
  });

  const chartCategories = categories.map((category) => ({
    name: category.categoryId,
    value: category.quantity,
    color: categoryColorMap[category.categoryId],
  }));

  return (
    <div className="flex h-[80%] w-full flex-col">
      <PieChart data={chartCategories} />
      <div className="flex flex-col gap-2 px-10">
        {chartCategories.map((category, index) => (
          <div className="flex gap-2" key={index}>
            <span
              className={`rounded-lg p-3`}
              style={{ backgroundColor: category.color }}
            ></span>
            <p>{category.name[0].toUpperCase() + category.name.slice(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPieChart;
