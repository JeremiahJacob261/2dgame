import type React from "react"

interface SplashScreenProps {
  onStart: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-4">2D Car Game</h1>
      <p className="mb-8 text-center">
        Avoid obstacles and survive as long as you can!
        <br />
        Use left/right arrows or tap sides to move.
        <br />
        Spacebar or tap center to pause.
      </p>
      <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-semibold" onClick={onStart}>
        Start Game
      </button>
    </div>
  )
}

export default SplashScreen

