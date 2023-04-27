import React from "react"
import "./_profile.scss"

interface ProfileData {
  name: string
  email: string
  handle: string
}

const Profile: React.FC = () => {
  const sampleData: ProfileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    handle: "john_doe",
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h3>Profile</h3>
      </div>
      <div className="profile-info">
        <div className="profile-info-item">
          <span className="label">Name:</span>
          <span className="value">{sampleData.name}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">Email:</span>
          <span className="value">{sampleData.email}</span>
        </div>
        <div className="profile-info-item">
          <span className="label">Handle:</span>
          <span className="value">{sampleData.handle}</span>
        </div>
      </div>
    </div>
  )
}

export default Profile
