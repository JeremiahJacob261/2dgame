export interface GameState {
  playerPosition: number
  obstacles: Obstacle[]
  score: number
  isGameOver: boolean
  isPaused: boolean
  speed: number
  lastSpeedIncreaseTime: number
  obstacleSpawnRate: number
}

interface Obstacle {
  lane: number
  y: number
  length: number
}

export const LANE_COUNT = 5
const MAX_SPEED_MULTIPLIER = 5
const INITIAL_SPAWN_INTERVAL = 200
const MIN_SPAWN_INTERVAL = 100
const SPEED_INCREASE_INTERVAL = 2000 // 2 seconds
const SPEED_INCREASE_AMOUNT = 0.1

export const updateGame = (
  gameState: GameState,
  currentTime: number,
  canvasSize: { width: number; height: number },
): GameState => {
  if (gameState.isPaused || gameState.isGameOver) return gameState

  let newSpeed = gameState.speed
  let lastSpeedIncreaseTime = gameState.lastSpeedIncreaseTime
  let newObstacleSpawnRate = gameState.obstacleSpawnRate

  // Increase speed every 2 seconds
  if (currentTime - lastSpeedIncreaseTime >= SPEED_INCREASE_INTERVAL) {
    newSpeed = Math.min(gameState.speed + SPEED_INCREASE_AMOUNT, MAX_SPEED_MULTIPLIER)
    lastSpeedIncreaseTime = currentTime

    // Adjust obstacle spawn rate based on speed
    const speedMultiplier = newSpeed
    newObstacleSpawnRate = Math.max(MIN_SPAWN_INTERVAL, Math.floor(INITIAL_SPAWN_INTERVAL / Math.sqrt(speedMultiplier)))
  }

  const newObstacles = gameState.obstacles
    .map((obstacle) => ({ ...obstacle, y: obstacle.y + newSpeed * (canvasSize.height / 844) }))
    .filter((obstacle) => obstacle.y < canvasSize.height)

  if (gameState.score % newObstacleSpawnRate === 0) {
    newObstacles.push({
      lane: Math.floor(Math.random() * LANE_COUNT),
      y: -canvasSize.height * 0.1,
      length: Math.floor(Math.random() * 3) + 1,
    })
  }

  const playerY = canvasSize.height * 0.8
  const playerHeight = canvasSize.height * 0.1

  const isCollision = newObstacles.some(
    (obstacle) =>
      obstacle.lane === gameState.playerPosition &&
      obstacle.y + playerHeight > playerY &&
      obstacle.y < playerY + playerHeight,
  )

  return {
    ...gameState,
    obstacles: newObstacles,
    score: isCollision ? gameState.score : gameState.score + 1,
    isGameOver: isCollision,
    speed: newSpeed,
    lastSpeedIncreaseTime,
    obstacleSpawnRate: newObstacleSpawnRate,
  }
}

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  canvasSize: { width: number; height: number },
) => {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

  // Draw road
  ctx.fillStyle = "#333"
  ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

  // Draw lane lines
  ctx.strokeStyle = "#fff"
  ctx.setLineDash([5, 10])
  for (let i = 1; i < LANE_COUNT; i++) {
    const x = (i * canvasSize.width) / LANE_COUNT
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvasSize.height)
    ctx.stroke()
  }

  const laneWidth = canvasSize.width / LANE_COUNT
  const playerWidth = laneWidth * 0.5
  const playerHeight = canvasSize.height * 0.1
  const playerY = canvasSize.height * 0.8

  // Draw player
  ctx.fillStyle = "blue"
  const playerX = gameState.playerPosition * laneWidth + (laneWidth - playerWidth) / 2
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight)

  // Draw obstacles
  ctx.fillStyle = "red"
  gameState.obstacles.forEach((obstacle) => {
    const obstacleX = obstacle.lane * laneWidth + (laneWidth - playerWidth) / 2
    ctx.fillRect(obstacleX, obstacle.y, playerWidth, playerHeight * obstacle.length)
  })

  // Draw score
  ctx.fillStyle = "white"
  ctx.font = `${canvasSize.height * 0.03}px Arial`
  ctx.fillText(`Score: ${gameState.score}`, 10, canvasSize.height * 0.05)

  // Draw speed
  ctx.fillText(`Speed: ${gameState.speed.toFixed(2)}x`, 10, canvasSize.height * 0.1)

  // Draw obstacle spawn rate
  ctx.fillText(`Spawn Rate: ${gameState.obstacleSpawnRate}`, 10, canvasSize.height * 0.15)
}

