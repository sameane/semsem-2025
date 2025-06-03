document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const scoreDisplay = document.getElementById('scoreDisplay');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const finalScoreDisplay = document.getElementById('finalScore');
    const playAgainButton = document.getElementById('playAgainButton');

    let canvasWidth, canvasHeight;

    // Game settings
    const SNAKE_SEGMENT_RADIUS = 8;
    const SNAKE_HEAD_RADIUS = 9; // Slightly larger for head
    const FOOD_RADIUS = 5;
    const ENEMY_RADIUS = 7;
    const SNAKE_SPEED = 2.5;
    const ENEMY_SPEED = 1.2;
    const ENEMY_SPAWN_INTERVAL = 180; // frames (e.g., 3 seconds at 60fps)
    const MIN_ENEMY_SPAWN_DISTANCE = 100;
    const SHOCKWAVE_SPEED = 5;
    const SHOCKWAVE_MAX_RADIUS = 150;
    const SHOCKWAVE_DURATION = 30; // frames

    // Game state
    let snake;
    let food;
    let enemies;
    let shockwaves;
    let score;
    let gameOver;
    let mouseX, mouseY;
    let enemySpawnTimer;
    let animationFrameId;

    function resizeCanvas() {
        const container = canvas.parentElement;
        canvasWidth = container.clientWidth;
        canvasHeight = container.clientHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        // Update mouse position relative to new canvas size if needed,
        // though it's generally better to get it fresh from events.
        // If the game is running, this could reset elements or scale them.
        // For simplicity, we'll re-initialize if game was running (or prompt user)
        // For now, just set dimensions. Game elements use these absolute dimensions.
    }

    function initGame() {
        snake = [{ x: canvasWidth / 2, y: canvasHeight / 2, radius: SNAKE_HEAD_RADIUS }];
        for (let i = 0; i < 4; i++) { // Initial length of 5
            growSnake();
        }
        
        spawnFood();
        enemies = [];
        shockwaves = [];
        score = 0;
        gameOver = false;
        enemySpawnTimer = ENEMY_SPAWN_INTERVAL;

        updateScoreDisplay();
        gameOverScreen.style.display = 'none';
        
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        gameLoop();
    }

    function growSnake() {
        const tail = snake[snake.length - 1];
        snake.push({ x: tail.x, y: tail.y, radius: SNAKE_SEGMENT_RADIUS });
    }

    function spawnFood() {
        do {
            food = {
                x: Math.random() * (canvasWidth - FOOD_RADIUS * 2) + FOOD_RADIUS,
                y: Math.random() * (canvasHeight - FOOD_RADIUS * 2) + FOOD_RADIUS,
                radius: FOOD_RADIUS
            };
        } while (isCollidingWithSnake(food.x, food.y, food.radius));
    }

    function isCollidingWithSnake(x, y, radius) {
        for (const segment of snake) {
            if (distance(x, y, segment.x, segment.y) < radius + segment.radius) {
                return true;
            }
        }
        return false;
    }

    function spawnEnemy() {
        let ex, ey;
        let attempts = 0;
        do {
            attempts++;
            const edge = Math.floor(Math.random() * 4);
            if (edge === 0) { // Top
                ex = Math.random() * canvasWidth;
                ey = -ENEMY_RADIUS;
            } else if (edge === 1) { // Right
                ex = canvasWidth + ENEMY_RADIUS;
                ey = Math.random() * canvasHeight;
            } else if (edge === 2) { // Bottom
                ex = Math.random() * canvasWidth;
                ey = canvasHeight + ENEMY_RADIUS;
            } else { // Left
                ex = -ENEMY_RADIUS;
                ey = Math.random() * canvasHeight;
            }
        } while (distance(ex, ey, snake[0].x, snake[0].y) < MIN_ENEMY_SPAWN_DISTANCE && attempts < 10);
        
        if (attempts < 10) { // Only spawn if a suitable spot is found quickly
             enemies.push({ x: ex, y: ey, radius: ENEMY_RADIUS, vx: 0, vy: 0 });
        }
    }

    function distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function handleGameOver() {
        gameOver = true;
        finalScoreDisplay.textContent = `Your score: ${score}`;
        gameOverScreen.style.display = 'flex';
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    // Drawing functions
    function drawBackground() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        // Dark blue/purple (top) -> reddish-orange (middle) -> lighter orange/yellow (bottom)
        // Approximation from image:
        gradient.addColorStop(0, '#2a0a4a');    // Darker purple/blue
        gradient.addColorStop(0.15, '#4A1B3D'); 
        gradient.addColorStop(0.5, '#cc5533');  // Reddish-Orange
        gradient.addColorStop(0.85, '#F1A208');
        gradient.addColorStop(1, '#FCCA4C');    // Lighter Orange/Yellow

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    function drawSnake() {
        snake.forEach((segment, index) => {
            ctx.beginPath();
            ctx.arc(segment.x, segment.y, segment.radius, 0, Math.PI * 2);
            ctx.fillStyle = index === 0 ? '#f0f0f0' : '#ffffff'; // Head slightly different
            ctx.fill();
            if (index === 0) { // Simple eye for head
                ctx.beginPath();
                let angleToMouse = Math.atan2(mouseY - segment.y, mouseX - segment.x);
                let eyeOffsetX = Math.cos(angleToMouse) * segment.radius * 0.4;
                let eyeOffsetY = Math.sin(angleToMouse) * segment.radius * 0.4;
                ctx.arc(segment.x + eyeOffsetX, segment.y + eyeOffsetY, segment.radius * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = 'black';
                ctx.fill();
            }
        });
    }

    function drawFood() {
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'lime';
        ctx.fill();
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.fill();
        });
    }

    function drawShockwaves() {
        shockwaves.forEach(sw => {
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.currentRadius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(173, 216, 230, ${sw.opacity})`; // Light blue
            ctx.lineWidth = 3;
            ctx.stroke();
        });
    }

    // Update functions
    function updateSnake() {
        if (typeof mouseX !== 'number' || typeof mouseY !== 'number') return;

        // Head follows mouse smoothly using lerp
        const head = snake[0];
        const lerpFactorHead = 0.18; // Lower = smoother
        head.x += (mouseX - head.x) * lerpFactorHead;
        head.y += (mouseY - head.y) * lerpFactorHead;

        // Body segments follow previous segment smoothly
        for (let i = 1; i < snake.length; i++) {
            const segment = snake[i];
            const prevSegment = snake[i - 1];
            const lerpFactorBody = 0.22; // Lower = smoother
            segment.x += (prevSegment.x - segment.x) * lerpFactorBody;
            segment.y += (prevSegment.y - segment.y) * lerpFactorBody;
        }
    }

    function updateEnemies() {
        enemies.forEach(enemy => {
            const dx = snake[0].x - enemy.x;
            const dy = snake[0].y - enemy.y;
            const dist = distance(snake[0].x, snake[0].y, enemy.x, enemy.y);
            if (dist > 1) {
                enemy.vx = (dx / dist) * ENEMY_SPEED;
                enemy.vy = (dy / dist) * ENEMY_SPEED;
            } else {
                enemy.vx = 0;
                enemy.vy = 0;
            }
            enemy.x += enemy.vx;
            enemy.y += enemy.vy;
        });
    }

    function updateShockwaves() {
        shockwaves = shockwaves.filter(sw => {
            sw.currentRadius += SHOCKWAVE_SPEED;
            sw.age++;
            sw.opacity = 1 - (sw.age / SHOCKWAVE_DURATION);
            return sw.currentRadius < SHOCKWAVE_MAX_RADIUS && sw.opacity > 0;
        });
    }

    function checkCollisions() {
        const head = snake[0];

        // Snake head vs Food
        if (distance(head.x, head.y, food.x, food.y) < head.radius + food.radius) {
            score += 10;
            updateScoreDisplay();
            growSnake();
            spawnFood();
        }

        // Snake vs Enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            // Head vs Enemy -> Game Over
            if (distance(head.x, head.y, enemy.x, enemy.y) < head.radius + enemy.radius) {
                handleGameOver();
                return; // Stop further checks
            }
            // Body vs Enemy -> Enemy dies
            for (let j = 1; j < snake.length; j++) {
                const segment = snake[j];
                if (distance(segment.x, segment.y, enemy.x, enemy.y) < segment.radius + enemy.radius) {
                    enemies.splice(i, 1);
                    score += 2; // Smaller score for body collision
                    updateScoreDisplay();
                    break; // Enemy destroyed, move to next enemy
                }
            }
        }
        
        // Shockwaves vs Enemies
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (distance(sw.x, sw.y, enemy.x, enemy.y) < sw.currentRadius + enemy.radius &&
                    distance(sw.x, sw.y, enemy.x, enemy.y) > sw.currentRadius - enemy.radius - 5 /* check within shockwave band */ ) {
                    enemies.splice(j, 1);
                    score += 5; // Score for shockwave kill
                    updateScoreDisplay();
                }
            }
        }
    }

    function gameLoop() {
        if (gameOver) return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackground();

        updateSnake();
        updateEnemies();
        updateShockwaves();
        checkCollisions(); // Check collisions after updates, before drawing new positions

        if (gameOver) return; // Collision might set gameOver

        drawSnake();
        drawFood();
        drawEnemies();
        drawShockwaves();

        // Enemy spawning
        enemySpawnTimer--;
        if (enemySpawnTimer <= 0) {
            spawnEnemy();
            enemySpawnTimer = ENEMY_SPAWN_INTERVAL;
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // Event Listeners
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0 && !gameOver) { // Left click
            shockwaves.push({
                x: snake[0].x,
                y: snake[0].y,
                currentRadius: 10,
                opacity: 1,
                age: 0
            });
        }
    });

    playAgainButton.addEventListener('click', () => {
        resizeCanvas(); // Ensure canvas dimensions are up-to-date
        initGame();
    });
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        // If game is active, might need to adjust positions or simply inform user
        // For now, a resize might clear the canvas until next frame draw
        // if game is not running, it's fine. If running, it just adapts.
        // No special handling needed for object positions as they use canvasWidth/Height
    });

    // Initial setup
    resizeCanvas(); // Set initial canvas size
    initGame(); // Start the game
});