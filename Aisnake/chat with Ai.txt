Please create a 'Snake' game using HTML, CSS, and vanilla JavaScript. The game should be inspired by the provided reference image.

Core Game Mechanics:

Snake:

The snake is composed of a series of white circular segments. The head segment can be slightly distinct (e.g., lighter white or a subtle eye).

Movement: The snake's head continuously follows the mouse cursor's position on the canvas. It should not be grid-based movement but rather smooth pursuit.

Growth: The snake grows longer by one segment each time it "eats" a green food dot.

Death: The snake dies (Game Over) if its head collides with a red enemy dot.

Food:

Represented as small green circular dots.

When eaten by the snake's head, it disappears, the snake grows, and the player's score increases (e.g., by 10 points).

A new food dot should then spawn at a random location on the canvas, avoiding spawning directly on the snake.

Enemies:

Represented as red circular dots, slightly larger than food dots but smaller than snake segments.

Enemies actively chase the snake's head.

New enemies spawn periodically at the edges of the canvas or a certain distance away from the snake.

Enemy Death: An enemy is destroyed if:

It collides with any part of the snake's body (not the head).

It is hit by a shockwave.

Destroying an enemy can award a smaller number of points (e.g., 2-5 points).

Shockwave:

Activated when the player performs a left-click.

Originates from the snake's head.

Visually, it's an expanding, semi-transparent circular wave (e.g., light blue).

It has a maximum radius and a limited duration.

Destroys any enemies it touches.

Visual Design & UI (Based on Reference Image):

Layout:

A main game canvas where all action takes place.

Title Area (Above Canvas):

Large, prominent "Snake game" title. The word "Snake" should be red with a thick dark blue outline/shadow. The word "game" can be similar or slightly subordinate.

Smaller text "made by AI" positioned slightly below and to the right of the main title.

Score Display: In the top-right corner of the game area (or canvas), display "Score: [current_score]" within a dark, semi-transparent rounded rectangle.

Control Hints: In the bottom-left corner of the game area (or canvas), display "Move: Mouse | Shockwave: Left-click" within a dark, semi-transparent rounded rectangle.

Tagline (Below Canvas/Game Area): The text "When you waste time, we benefit." in a bold white font.

Background: The game area should have a gradient background transitioning from dark blue/purple at the top, through reddish-orange in the middle, to a lighter orange/yellow at the bottom.

Game Over Screen:

When the game ends, display a modal/overlay.

This modal should be a dark, rounded rectangle in the center of the screen.

It should contain:

"Game Over" text.

"Your score: [final_score]".

A "Play Again" button (blue background, white text). Clicking this button should reset and restart the game.

Technical Requirements:

Use three separate files: index.html for structure, style.css for styling, and script.js for game logic.

No external JavaScript libraries (e.g., jQuery) should be used unless absolutely necessary for a specific visual effect that's hard to achieve otherwise (prefer vanilla JS).

The canvas should be reasonably responsive to different screen sizes, maintaining its aspect ratio if possible.

Game logic should be handled in script.js using the HTML5 Canvas API for drawing.

Mousemove events for snake control and mousedown events for the shockwave.

Please ensure all described mechanics and UI elements are implemented to create a functional and visually similar game to the reference.