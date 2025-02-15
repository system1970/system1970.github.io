from flask import Flask, render_template, request, jsonify, g
from flask_socketio import SocketIO, emit
import chess
import sqlite3

app = Flask(__name__)
socketio = SocketIO(app)  # Initialize Flask-SocketIO
DATABASE = 'games.db'

# Initialize a new chess board
board = chess.Board()

def get_db():
    """Open a new database connection if none exists for the current application context."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close the database connection at the end of each request."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def save_game(fen, moves):
    """Save the game state to the database."""
    db = get_db()
    cursor = db.cursor()
    cursor.execute("INSERT INTO games (fen, moves) VALUES (?, ?)", (fen, moves))
    db.commit()

@app.route('/')
def index():
    return render_template('index.html')  # Renders the HTML page with the chessboard

@app.route('/new_game', methods=['POST'])
def new_game():
    global board
    board = chess.Board()  # Reset the board

    # Clear the database
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM games")  # Delete all rows in the games table
    db.commit()

    socketio.emit('update_board', {'fen': board.fen()})  # Notify clients
    return jsonify({"message": "New game started", "board": board.fen()})

@app.route('/make_move', methods=['POST'])
def make_move():
    global board
    move = request.json.get('move')  # Move in UCI format (e.g., "e2e4")

    try:
        chess_move = chess.Move.from_uci(move)
        if chess_move in board.legal_moves:
            board.push(chess_move)
            fen = board.fen()
            moves = ','.join([m.uci() for m in board.move_stack])
            save_game(fen, moves)  # Save the current board state to the database
            socketio.emit('update_board', {'fen': fen})  # Send update to clients
            return jsonify({"message": "Move played", "board": fen})
        else:
            return jsonify({"error": "Illegal move"}), 400
    except ValueError:
        return jsonify({"error": "Invalid move format"}), 400

@socketio.on('connect')
def handle_connect():
    """Send the current board state when a new client connects."""
    emit('update_board', {'fen': board.fen()})

if __name__ == '__main__':
    socketio.run(app, debug=True)
