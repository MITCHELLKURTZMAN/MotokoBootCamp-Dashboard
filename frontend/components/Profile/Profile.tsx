import React, { useEffect } from "react"
import "./_profile.scss"
import { useUserStore } from "../../store/userStore"
import { useAuthStore } from "../../store/authstore"
import { Student } from "../../types/types"

interface Props {
  user: Student
}

const Profile: React.FC<Props> = ({}) => {
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    console.log("Profile component mounted")
    useUserStore.getState().getUser(useAuthStore.getState().principalText)

    return () => {
      console.log("Profile component unmounted")
    }
  }, [])

  return (
    <div className="profile">
      <div className="profile-header">
        <h3>Profile</h3>
      </div>
      <div className="profile-info">
        <div className="profile-info-item">
          <span className="label">Name:</span>
          <span className="value">{user?.name}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">Team:</span>
          <span className="value">{user?.teamName}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">Rank:</span>
          <span className="value">{user?.rank}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">Score:</span>
          <span className="value">{user?.score.toString()}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">CLI Principal ID:</span>
          <span className="value">{user?.cliPrincipalId}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">Principal ID:</span>
          <span className="value">{user?.principalId}</span>
        </div>
      </div>
    </div>
  )
}

export default Profile
