import { IoAnalytics } from 'react-icons/io5';
import { MdArrowDropUp } from 'react-icons/md';

const bgColorClasses = ['bg-statistic-1', 'bg-statistic-2', 'bg-statistic-3'];

const iconColorClasses = ['fill-red-600', 'fill-purple-600', 'fill-green-600'];

export type Stat = {
  title: string;
  value: string;
  percentageChange: string;
};

type StatCardProps = {
  stat: Stat;
  ind: number;
};

function StatCard({ stat, ind }: StatCardProps) {
  return (
    <div
      className={`flex flex-1 flex-col justify-between ${bgColorClasses[ind]} px-5 py-5 text-primary`}
      key={stat.title}
    >
      <h2 className="text-muted-foreground">{stat.title}</h2>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">{stat.value}</p>
        <IoAnalytics className={`h-12 w-12 ${iconColorClasses[ind]}`} />
      </div>
      <div className="flex gap-3">
        <p className="inline-block">Since last week</p>
        <span className="rounded-sm bg-secondary p-0.5 text-muted-foreground">
          {isNaN(Number(stat.percentageChange)) ? 0 : stat.percentageChange}%
          <MdArrowDropUp className="inline-block" />
        </span>
      </div>
    </div>
  );
}

export default StatCard;
