import SimpleLineChart from '@/components/shared/ui/SimpleLineChart';
import { fetchOrdersByStoreId } from '@/lib/services/order';
import { auth } from '@/lib/auth';

async function OrderLineChart() {
  const session = await auth();
  const store = session?.user.store;

  const ordersToStore = await fetchOrdersByStoreId({
    storeId: store?.id || '',
  });

  // console.log(JSON.stringify(orders, null, 2));

  if (!ordersToStore) throw new Error('Something went wrong');

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const orderByMonths = ordersToStore.reduce((acc, item) => {
    if (item.order.orderStatus === 'COMPLETED') {
      const month = new Date(item.order.createdAt!).getMonth();
      acc[month] = (acc[month] || 0) + +1;
    }
    return acc;
  }, {} as Record<number, number>);

  const chartData = months.map((month, index) => ({
    Months: month,
    Sales: orderByMonths[index] || 0,
  }));

  return (
    <SimpleLineChart
      data={chartData}
      xAxisDataKey="Months"
      lines={[{ dataKey: 'Sales', stroke: '#8884d8' }]}
    />
  );
}

export default OrderLineChart;
