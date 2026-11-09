import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatTilesSkeleton } from "@/components/features/StatTiles";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading overview">
      <StatTilesSkeleton />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-56 w-full" />
        </Card>
        <Card className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-56 w-full" />
        </Card>
      </div>
    </div>
  );
}
