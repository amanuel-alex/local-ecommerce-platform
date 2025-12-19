import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface ActivityItem {
  id: string
  type: 'sale' | 'user' | 'order' | 'product'
  title: string
  description: string
  time: string
  status: 'completed' | 'pending' | 'failed'
}

interface RecentActivitiesProps {
  activities: ActivityItem[]
  className?: string
}

export function RecentActivities({ activities, className }: RecentActivitiesProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Activities</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {activity.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : activity.status === 'pending' ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{activity.time}</span>
                    <ArrowRight className="mx-2 h-3 w-3" />
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
