import React from "react"
import ActivityItem from "./ActivityItem"

interface Activity {
  id: number
  description: string
}

interface ActivityListProps {
  activities: Activity[]
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <section>
      <h2>Activities</h2>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </section>
  )
}

export default ActivityList
