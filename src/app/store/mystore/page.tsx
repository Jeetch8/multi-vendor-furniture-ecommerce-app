import Map from '@/components/shared/ui/Map';
import LatestOrdersTable from '@/components/main/mystore/LatestOrdersTable';
import OrderLineChart from '@/components/main/mystore/OrderLineChart';
import OrderPieChart from '@/components/main/mystore/OrderPieChart';
import PerformanceStatsPanel from '@/components/main/mystore/PerformanceStatsPanel';

async function MyStorePage() {
  return (
    <div className="grid-row-12 grid h-full grid-cols-5 gap-8 pb-5">
      <PerformanceStatsPanel />

      <div className="col-span-3 row-start-2 row-end-4 flex flex-col px-5 pb-3 pt-5">
        <h2 className="text-2xl font-bold">Sales</h2>
        <div className="h-[300px]">
          <OrderLineChart />
        </div>
      </div>

      <div className="col-span-2 row-start-1 row-end-3 p-5">
        <h2 className="text-2xl font-bold">Top Selling Categories</h2>

        <OrderPieChart />
      </div>

      <div className="col-span-3 row-start-4 row-end-13 overflow-y-auto p-5">
        <LatestOrdersTable />
      </div>

      <div className="col-span-2 row-start-3 row-end-8 flex h-full flex-col p-5">
        <h2 className="text-2xl font-bold">Customers</h2>

        <div className="relative mt-4 flex-grow">
          <Map />
        </div>
      </div>
    </div>
  );
}

export default MyStorePage;
