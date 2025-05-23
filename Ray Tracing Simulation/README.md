# RAY (A p5.js Creation)

This project is a browser-based game or interactive simulation named "RAY," developed using **p5.js**, a JavaScript library for creative coding.

## Description

RAY showcases several advanced concepts within creative coding and game development:

*   **Performant Game Mechanics:** Optimized for smooth interaction and gameplay.
*   **Flow Fields:** Used for dynamic movement of particles or entities.
*   **Procedural Generation:** L-systems are employed for level design, allowing for complex and varied game environments.
*   **2D Raycasting:** Implemented for interactive elements, collision detection, or visibility calculations.
*   **Dialogue System:** Includes a system for displaying dialogues (`DialogueSystem.js`).
*   **Level Structure:** Features multiple levels (`levels/` directory) and transitions between them (`levelTransition.js`).

The project involves various game objects like particles, boundaries, and rays, each with their own logic (`objects/` directory).

## How to Play/View

1.  Clone this repository or download the files in the `Ray Tracing Simulation` directory.
2.  Open the `ray.html` file in a modern web browser that supports HTML5 Canvas and JavaScript.
3.  The game/simulation should load. The main `index.html` for the portfolio mentions: "[Try holding down your mouse click]".

## Project Structure

*   `ray.html`: The main HTML file to launch the game/simulation.
*   `sketch.js`: The primary p5.js sketch file containing the main game loop and setup.
*   `DialogueSystem.js`: Handles the display and logic for in-game dialogues.
*   `levelTransition.js`: Manages transitions between different game levels.
*   `utility.js`: Contains utility functions used across the project.
*   `assets/`:
    *   `TextAssests/`: JavaScript files that might contain dialogue text or game messages (e.g., `Locked.js`, `gameOver.js`).
    *   `fonts/`: Font files used in the game.
*   `levels/`: Contains JavaScript files defining different game levels (e.g., `level1.js`, `level2.js`).
*   `objects/`: Contains JavaScript files defining various game objects:
    *   `boundary.js`: For walls or obstacles.
    *   `codeWindow.js`: Purpose unclear from name, might be related to UI or an in-game element.
    *   `particle.js`: For particles, possibly used with flow fields or raycasting.
    *   `plant.js`: Possibly an L-system generated plant or an interactive object.
    *   `ray.js`: For implementing raycasting.
*   `p3.png`: A preview image of the project.

## Dependencies

*   p5.js: The core library. It's typically included via a CDN link in `ray.html` or bundled with the project.
