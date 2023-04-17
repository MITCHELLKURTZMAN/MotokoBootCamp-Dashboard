import React, { useState } from "react"
import "./_submit.scss"

const Submit: React.FC = () => {
  const [canisterId, setCanisterId] = useState<string>("")
  const [day, setDay] = useState<string>("1")
  const [showModal, setShowModal] = useState<boolean>(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(`Submitting canister ID: ${canisterId}, Day: ${day}`)
  }

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
          onChange={(e) => setDay(e.target.value)}
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
          <li>Day 1: Passed</li>
          <li>
            Day 2: Failed{" "}
            <button
              style={{
                borderRadius: "10px",
                padding: "0 5px",
                cursor: "pointer",
                fontSize: "rem",
              }}
              onClick={() => setShowModal(true)}
            >
              ?
            </button>
          </li>
          <li>Day 3: Not Submitted</li>
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
