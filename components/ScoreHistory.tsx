import type React from "react"

interface ScoreHistoryProps {
  scores: { score: number; timestamp: string }[]
  onClose: () => void
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({ scores, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Score History</h2>
        <ul className="mb-4 max-h-60 overflow-y-auto">
          {scores.map((score, index) => (
            <li key={index} className="mb-2">
              <span className="font-semibold">{score.score}</span> - {score.timestamp}
            </li>
          ))}
        </ul>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default ScoreHistory

