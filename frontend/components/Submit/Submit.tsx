import React, { useEffect, useState } from "react"
import "./_submit.scss"
import { useUserStore } from "../../store/userStore"

const Submit: React.FC = () => {
  const [canisterId, setCanisterId] = useState<string>("")
  const [day, setDay] = useState<number>(1)
  const [showModal, setShowModal] = useState<boolean>(false)

  const user = useUserStore((state) => state.user)
  const verify = useUserStore((state) => state.verifyProject)
  const result = useUserStore((state) => state.result)

  const mapResultToStatus = () => {
    return Object.entries(result).map(([day, status]) => {
      if (status === "pass") return `Day ${day}: Passed`
      if (status === "fail") return `Day ${day}: Failed`
      return `Day ${day}: Not Submitted`
    })
  }

  const submissionStatusList = mapResultToStatus()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(`Submitting canister ID: ${canisterId}, Day: ${day}`)
    await verify(canisterId, day)
    mapResultToStatus()
  }

  useEffect(() => {
    mapResultToStatus()
  }, [verify, result])

  return (
    <div className="submit">
      <h2 className="submit__header">Submit Your Project</h2>
      <form className="submit__form" onSubmit={handleSubmit}>
        <label htmlFor="canisterId">Canister ID:</label>
        <input
          type="text"
          id="canisterId"
          value={canisterId}
          onChange={(e) => setCanisterId(e.target.value)}
          required
        />

        <label htmlFor="day">Day:</label>
        <select
          id="day"
          value={day}
          onChange={(e) => setDay(e.target.value as unknown as number)}
          required
        >
          <option value="1">Day 1</option>
          <option value="2">Day 2</option>
          <option value="3">Day 3</option>
          <option value="4">Day 4</option>
          <option value="5">Day 5</option>
        </select>

        <button className="btn" type="submit">
          Submit
        </button>
      </form>

      <div className="submission-status">
        <h2 className="submit__header">Submission Status</h2>
        <ul className="submission-status__list">
          {submissionStatusList.map((status, index) => (
            <li key={index}>{status}</li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <p>Failure information for Day 2:</p>
            <p>Reason: Incomplete implementation</p>
            <p>
              Details: The submitted canister did not pass all the tests
              required for Day 2.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Submit
