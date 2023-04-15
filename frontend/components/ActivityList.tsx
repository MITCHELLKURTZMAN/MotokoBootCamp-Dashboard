import React from "react"
import ActivityItem from "./ActivityItem"
import { Activity } from "../types/types"

interface ActivityListProps {
  activities: Activity[]
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <section className="activities">
      <h2>Intelligence Updates</h2>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </section>
  )
}

export default ActivityList
