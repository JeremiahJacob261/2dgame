import { useEffect } from "react"
import type { GameState } from "../utils/gameLogic"

export const useKeyboardControls = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  setShowScoreHistory: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  useEffect(() => {
    let lastKeyPressTime = 0
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setGameState((prevState) => ({
          ...prevState,
          playerPosition: Math.max(0, prevState.playerPosition - 1),
        }))
      } else if (e.key === "ArrowRight") {
        setGameState((prevState) => ({
          ...prevState,
          playerPosition: Math.min(4, prevState.playerPosition + 1),
        }))
      } else if (e.key === " ") {
        const currentTime = new Date().getTime()
        if (currentTime - lastKeyPressTime < 300) {
          setShowScoreHistory(true)
        } else {
          setGameState((prevState) => ({ ...prevState, isPaused: !prevState.isPaused }))
        }
        lastKeyPressTime = currentTime
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [setGameState, setShowScoreHistory])
}

