# Online Chess Game

This project is a web-based online chess application.

## Description

The application appears to be built using a Python web framework (likely Flask, given `app.py` and the `static`/`templates` structure). It uses a JavaScript library for the chessboard interface (`chessboard.js`, located in `static/Chess/`) and includes its own database (`games.db`, possibly SQLite) for storing game state or user information.

## Features (Inferred)

*   Play chess against another player online.
*   User accounts and game saving/loading (suggested by `games.db`).
*   Web interface rendered from HTML templates and styled with CSS.

## Project Structure

*   `app.py`: The main Python application file. This is likely the entry point to run the server.
*   `games.db`: A database file, probably SQLite, used to store game data, user accounts, or other application state.
*   `static/`: Contains static assets:
    *   `static/Chess/`: Contains the `chessboard.js` library (version 0.3.0 based on its own README/package.json), which is used for the interactive chessboard UI. This subdirectory has its own `README.md`, `LICENSE.md`, etc., pertaining to the library itself.
    *   `static/css/`: (Assumed, common practice) Custom CSS files for styling.
    *   `static/js/`: (Assumed, common practice) Custom JavaScript files for client-side logic.
    *   `static/img/`: Contains images, including chess piece graphics.
*   `templates/`: Contains HTML templates (e.g., `index.html`) that are rendered by the Python web framework.

## How to Run (Hypothesized)

1.  **Prerequisites:**
    *   Python 3.x
    *   A Python web framework (e.g., Flask). You'll likely need to install it (e.g., `pip install Flask`).
    *   Other Python dependencies that might be imported in `app.py`. Check `app.py` for imports and install them.
2.  **Set up Database (if needed):**
    *   The `games.db` file might be created automatically, or `app.py` might have a command or function to initialize it.
3.  **Run the Application:**
    *   Navigate to the `Online Chess/` directory.
    *   Run the Python application, typically with a command like `python app.py` or `flask run`.
    *   Open your web browser and go to the address provided by the application (e.g., `http://127.0.0.1:5000`).

**Note:** Examine `app.py` for specific instructions on dependencies, database setup, and how to run the application. The `chessboard.js` library in `static/Chess/` is a third-party component and has its own documentation.
