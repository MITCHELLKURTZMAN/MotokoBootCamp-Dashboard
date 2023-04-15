import React from "react"
import { Activity } from "../types/types"

interface ActivityItemProps {
  activity: Activity
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const isSpecialAnnouncement = activity.specialAnnouncement
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
        isSpecialAnnouncement ? "special-announcement" : ""
      }`}
    >
      <p>
        {activity.description} {randomEmoji()}
      </p>
    </div>
  )
}

export default ActivityItem
