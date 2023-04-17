import React from "react"
import { Activity } from "../../types/types"
import "./_activity.scss"

interface ActivityItemProps {
  activity: Activity
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const isSpecialAnnouncement =
    activity.specialAnnouncement === "newStudent" ||
    activity.specialAnnouncement === "newTeam"

  const emojis = [
    "🎉",
    "🪖",
    "🎖️",
    "✊",
    "💪",
    "👊",
    "🛡️",
    "🎗️",
    "🏋️",
    "🏅",
    "🌟",
  ]

  const randomEmoji = () => {
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  return (
    <div
      className={`activity-item ${
        isSpecialAnnouncement
          ? `special-announcement-${activity.specialAnnouncement}`
          : ""
      }`}
    >
      <p>
        {activity.activity} {randomEmoji()}
      </p>
    </div>
  )
}

export default ActivityItem
