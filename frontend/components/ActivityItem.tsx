import React from "react"

interface Activity {
  id: number
  description: string
}

interface ActivityItemProps {
  activity: Activity
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <div className="activity-item">
      <p>{activity.description}</p>
    </div>
  )
}

export default ActivityItem
