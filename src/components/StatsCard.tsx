
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple";
}

export const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 bg-blue-100 text-blue-600",
    green: "from-green-500 to-green-600 bg-green-100 text-green-600",
    purple: "from-purple-500 to-purple-600 bg-purple-100 text-purple-600",
  };

  const gradientClass = colorClasses[color].split(" ")[0] + " " + colorClasses[color].split(" ")[1];
  const iconBgClass = colorClasses[color].split(" ")[2] + " " + colorClasses[color].split(" ")[3];

  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${iconBgClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
