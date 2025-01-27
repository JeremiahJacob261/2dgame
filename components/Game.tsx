import type React from "react"
import { useRef, useEffect, useState, useCallback } from "react"
import { drawGame, updateGame, type GameState, LANE_COUNT } from "../utils/gameLogic"
import { useKeyboardControls } from "../hooks/useKeyboardControls"
import SplashScreen from "./SplashScreen"
import ScoreHistory from "./ScoreHistory"

const MAX_WIDTH = 390 // Max width of iPhone 14 Pro Max
const MAX_HEIGHT = 844 // Max height of iPhone 14 Pro Max
const ASPECT_RATIO = 9 / 19.5 // Aspect ratio of iPhone 14 Pro Max

const INITIAL_OBSTACLE_SPEED = 1
const INITIAL_SPAWN_INTERVAL = 1500

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [gameState, setGameState] = useState<GameState>({
    playerPosition: Math.floor(LANE_COUNT / 2),
    obstacles: [],
    score: 0,
    isGameOver: false,
    isPaused: true,
    speed: INITIAL_OBSTACLE_SPEED,
    lastSpeedIncreaseTime: 0,
    obstacleSpawnRate: INITIAL_SPAWN_INTERVAL,
  })
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const [showScoreHistory, setShowScoreHistory] = useState(false)
  const [scoreHistory, setScoreHistory] = useState<{ score: number; timestamp: string }[]>([])

  const updateCanvasSize = useCallback(() => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    let newWidth, newHeight

    if (screenWidth / screenHeight > ASPECT_RATIO) {
      newHeight = Math.min(screenHeight, MAX_HEIGHT)
      newWidth = newHeight * ASPECT_RATIO
    } else {
      newWidth = Math.min(screenWidth, MAX_WIDTH)
      newHeight = newWidth / ASPECT_RATIO
    }

    setCanvasSize({ width: newWidth, height: newHeight })
  }, [])

  useEffect(() => {
    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [updateCanvasSize])

  useKeyboardControls(gameState, setGameState, setShowScoreHistory)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let lastUpdateTime = 0
    const updateInterval = 50 // Update every 50ms (20 fps)

    const render = (currentTime: number) => {
      if (!gameState.isPaused && !gameState.isGameOver) {
        if (currentTime - lastUpdateTime > updateInterval) {
          const updatedState = updateGame(gameState, currentTime, canvasSize)
          setGameState(updatedState)
          lastUpdateTime = currentTime
        }
        drawGame(ctx, gameState, canvasSize)
      }
      animationFrameId = requestAnimationFrame(render)
    }

    render(0)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [gameState, canvasSize])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const touchX = touch.clientX - canvasRect.left

    if (touchX < canvasRect.width / 3) {
      setGameState((prevState) => ({
        ...prevState,
        playerPosition: Math.max(0, prevState.playerPosition - 1),
      }))
    } else if (touchX > (canvasRect.width * 2) / 3) {
      setGameState((prevState) => ({
        ...prevState,
        playerPosition: Math.min(LANE_COUNT - 1, prevState.playerPosition + 1),
      }))
    } else {
      togglePause()
    }
  }

  const togglePause = () => {
    setGameState((prevState) => ({ ...prevState, isPaused: !prevState.isPaused }))
  }

  const startGame = () => {
    setShowSplashScreen(false)
    setGameState((prevState) => ({
      ...prevState,
      isPaused: false,
      isGameOver: false,
      score: 0,
      speed: INITIAL_OBSTACLE_SPEED,
      lastSpeedIncreaseTime: 0,
      obstacleSpawnRate: INITIAL_SPAWN_INTERVAL,
    }))
  }

  const handleDoubleClick = () => {
    setShowScoreHistory(true)
  }

  const restartGame = () => {
    const newScoreHistory = [{ score: gameState.score, timestamp: new Date().toLocaleString() }, ...scoreHistory]
    setScoreHistory(newScoreHistory)
    setGameState({
      playerPosition: Math.floor(LANE_COUNT / 2),
      obstacles: [],
      score: 0,
      isGameOver: false,
      isPaused: false,
      speed: INITIAL_OBSTACLE_SPEED,
      lastSpeedIncreaseTime: 0,
      obstacleSpawnRate: INITIAL_SPAWN_INTERVAL,
    })
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-800">
      {showSplashScreen ? (
        <SplashScreen onStart={startGame} />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border-4 border-white"
            onTouchStart={handleTouchStart}
            onDoubleClick={handleDoubleClick}
          />
          {gameState.isGameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded">
                <h2 className="text-2xl font-bold mb-2">Game Over</h2>
                <p className="mb-4">Score: {gameState.score}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={restartGame}>
                  Restart
                </button>
              </div>
            </div>
          )}
          {showScoreHistory && <ScoreHistory scores={scoreHistory} onClose={() => setShowScoreHistory(false)} />}
        </>
      )}
    </div>
  )
}

export default Game

