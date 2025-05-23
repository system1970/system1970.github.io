# File Explorer Chess

This project implements a chess game that is played by interacting with files and folders in your operating system's file explorer.

## Description

This is an unconventional approach to a chess game. The game state, including piece positions, is represented by the file system structure (directories and `.txt` files within the `ChessGame/board/` directory). The `main.py` script likely monitors changes to these files/folders or is run by the user to process moves.

This project explores creative ways of using fundamental operating system interactions (file system operations) as a game interface.

## How to Play (Hypothesized)

**Note:** Detailed instructions on how to play are not available and the following is a hypothesis based on the file structure. The `main.py` script is crucial for the game logic.

1.  Clone this repository or download the files in the `File Explorer Chess` directory.
2.  You will likely need Python installed to run `main.py`.
3.  **Understanding the Board:**
    *   The `ChessGame/board/` directory represents the chessboard.
    *   Files like `11A1wR.txt` might represent a piece (e.g., White Rook at A1). The naming convention seems to be `[Row][Col][Square][Color][Piece].txt`. Empty squares might be represented by files with no piece information or by the absence of a file.
4.  **Making Moves:**
    *   Playing the game might involve renaming, moving, or deleting these files according to chess rules. For example, to move a piece, you might rename its file to reflect the new position.
    *   The `main.py` script might need to be run after each manual file operation to validate the move, update the board state (if necessary), or manage turns.
5.  Consult the `main.py` script for more specific instructions or run it (e.g., `python main.py --help` if argument parsing is implemented, or `python main.py`) to see if it provides guidance.

## Files

*   `main.py`: The Python script that contains the game logic. This is essential for understanding how to play.
*   `ChessGame/`: A directory containing the game state.
    *   `ChessGame/board/`: Contains text files representing the pieces and their positions on the board. The file names encode the piece type, color, and square.

## Important Considerations

*   This project is highly experimental. Be cautious when running scripts that interact heavily with the file system.
*   Understanding the logic in `main.py` is key to playing the game as intended.
