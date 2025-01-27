import StatCard from './StatCard';
import { auth } from '@/lib/auth';
import { fetchStorePerformace } from '@/lib/services/store';

async function PerformanceStatsPanel() {
  const session = await auth();
  const store = session?.user?.store;

  const storePerformanceQuery = await fetchStorePerformace(store?.id as string);
  const {
    customersLastWeek,
    ordersLastWeek,
    salesLastWeek,
    totalCustomers,
    totalOrders,
    totalSales,
  } = storePerformanceQuery[0];

  const salesUntilLastWeek =
    parseFloat(totalSales ?? '0') - parseFloat(salesLastWeek ?? '0');
  const ordersUntilLastWeek = totalOrders - ordersLastWeek;
  const customersUntilLastWeek = totalCustomers - customersLastWeek;

  const statistics = [
    {
      title: 'Total Sales',
      value: '$' + totalSales?.toString(),
      percentageChange: (
        (parseFloat(salesLastWeek ?? '0') * 100) /
        (salesUntilLastWeek ?? 0)
      ).toFixed(2),
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      percentageChange: (
        (ordersLastWeek * 100) /
        (ordersUntilLastWeek ?? 0)
      ).toFixed(2),
    },
    {
      title: 'Total Customers',
      value: totalCustomers.toString(),
      percentageChange: (
        (customersLastWeek * 100) /
        (customersUntilLastWeek ?? 0)
      ).toFixed(2),
    },
  ];

  return (
    <div className="col-span-3 row-start-1 row-end-2 flex gap-4">
      {statistics.map((stat, ind) => (
        <StatCard key={ind} stat={stat} ind={ind} />
      ))}
    </div>
  );
}

export default PerformanceStatsPanel;
