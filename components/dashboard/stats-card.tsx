import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "increase" | "decrease";
  className?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  className,
  isLoading = false,
  ...props
}: StatsCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-2" />
            ) : (
              <h3 className="text-2xl font-bold">{value}</h3>
            )}
          </div>
          <div className="rounded-lg p-3 bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        {change && (
          <div className="mt-4 flex items-center">
            {changeType === "increase" ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
            <span className="ml-1 text-sm text-muted-foreground">{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
