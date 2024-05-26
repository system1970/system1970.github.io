import os
import shutil

current_player = "white"

def create_chess_board(base_dir):
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)
    os.makedirs(base_dir)
    
    board_dir = os.path.join(base_dir, 'board')
    os.makedirs(board_dir, exist_ok=True)

    initial_positions = {
        'wR': ['A1', 'H1'], 'wN': ['B1', 'G1'], 'wB': ['C1', 'F1'], 
        'wQ': ['D1'], 'wK': ['E1'], 'wP': ['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2'],
        'bR': ['A8', 'H8'], 'bN': ['B8', 'G8'], 'bB': ['C8', 'F8'], 
        'bQ': ['D8'], 'bK': ['E8'], 'bP': ['A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7']
    }

    def create_board_and_pieces():
        for row in range(8, 0, -1):
            for col in range(1, 9):
                piece = next((piece for piece, positions in initial_positions.items() if (chr(64 + col) + str(row)) in positions), None)
                content = piece if piece else ""
                tile = f"{row}{col}{chr(64 + col)}{row}{content}"
                file_name = f"{tile}.txt"
                # print(file_name, tile, piece, )
                file_path = os.path.join(board_dir, file_name)
                
                with open(file_path, 'w') as f:
                    pass

    create_board_and_pieces()
 
def find_files_with_prefix(directory, prefix):
    matching_files = [1]

    for filename in os.listdir(directory):
        if filename.startswith(prefix):
            matching_files.append(filename)
    
    return matching_files

# Function to move a piece
def move_piece(base_dir, start, end):
    board_dir = os.path.join(base_dir, 'board')

    get_pos = lambda pos: find_files_with_prefix(board_dir, f"{list(pos)[1] + str(ord(list(pos)[0])-64)}" + pos)[-1]
    start_file = os.path.join(board_dir, f"{get_pos(start)}")
    end_file = os.path.join(board_dir, f"{get_pos(end)}")

    print(start_file)
    print(start_file.split("\\")[-1])
    start_piece = len(start_file.split("\\")[-1])==10
    if not os.path.exists(start_file) or not start_piece: 
        print(f"No piece at {start}.")
        return

    piece = start_file.split("\\")[-1][-6:]

    end_piece = len(end_file.split("\\")[-1])==10

    # print(start_file)
    os.remove(start_file)
    os.remove(end_file)

    get_file_name = lambda pos: f"{list(pos)[1] + str(ord(list(pos)[0])-64)}" + pos
    end_file = os.path.join(board_dir, get_file_name(end) + piece)
    with open(end_file, 'w') as f:
        pass
    start_file = os.path.join(board_dir, get_file_name(start))
    with open(start_file, 'w') as f:
        pass

    print(f"Moved {piece} from {start} to {end}.")

    return True

def validate_move(board_dir, start, end):
    global current_player

    columns = 'ABCDEFGH'
    rows = '12345678'

    if start[0] not in columns or start[1] not in rows or end[0] not in columns or end[1] not in rows:
        return False

    get_pos = lambda pos: find_files_with_prefix(board_dir, f"{list(pos)[1] + str(ord(list(pos)[0])-64)}" + pos)[-1]
    start_file = os.path.join(board_dir, f"{get_pos(start)}")
    end_file = os.path.join(board_dir, f"{get_pos(end)}")

    if not os.path.exists(start_file):
        return False

    start_piece = len(start_file.split("\\")[-1])==10

    if not start_piece:
        return False
    
    piece = start_file.split("\\")[-1][-6:-4]

    if piece[0]!=current_player[0]:
        print("That is not your piece.")
        return False

    piece_type = piece[1]
    start_col, start_row = ord(start[0]), int(start[1])
    end_col, end_row = ord(end[0]), int(end[1])

    def is_path_clear(start, end):
        def is_there_a_piece(col, row):
            pos = find_files_with_prefix(board_dir, f"{(col - 64)}{row}")[-1]
            return len(pos.split("\\")[-1])==10
        if start_col == end_col:
            step = 1 if start_row < end_row else -1
            for row in range(start_row + step, end_row, step):
                if is_there_a_piece(start_col, row):
                    return False
        elif start_row == end_row:
            step = 1 if start_col < end_col else -1
            for col in range(start_col + step, end_col, step):
                if is_there_a_piece(col, start_row):
                    return False
        else:
            col_step = 1 if start_col < end_col else -1
            row_step = 1 if start_row < end_row else -1
            col, row = start_col + col_step, start_row + row_step
            while col != end_col and row != end_row:
                if is_there_a_piece(col, row):
                    return False
                col += col_step
                row += row_step
        return True

    if(end_file.split("\\")[-1][-6:-4][0] == piece[0]):
        return False

    if piece_type == 'P':  # Pawn
        if start_col == end_col and ((piece[0] == 'w' and end_row == start_row + 1) or (piece[0] == 'b' and end_row == start_row - 1)):
            return True
        if abs(start_col - end_col) == 1 and ((piece[0] == 'w' and end_row == start_row + 1) or (piece[0] == 'b' and end_row == start_row - 1)):
            return len(end_file.split("\\")[-1])==10 and end_file.split("\\")[-1][-6:-4][0] != piece[0]
        return False
    elif piece_type == 'R':  # Rook
        if start_col == end_col or start_row == end_row:
            return is_path_clear(start, end)
    elif piece_type == 'N':  # Knight
        if (abs(start_col - end_col), abs(start_row - end_row)) in [(1, 2), (2, 1)]:
            return True
    elif piece_type == 'B':  # Bishop
        if abs(start_col - end_col) == abs(start_row - end_row):
            return is_path_clear(start, end)
    elif piece_type == 'Q':  # Queen
        if start_col == end_col or start_row == end_row or abs(start_col - end_col) == abs(start_row - end_row):
            return is_path_clear(start, end)
    elif piece_type == 'K':  # King
        if abs(start_col - end_col) <= 1 and abs(start_row - end_row) <= 1:
            return True

    return False

def switch_player():
    global current_player
    return 'white' if current_player == 'black' else 'black'

def command_line_interface(base_dir):
    global current_player
    create_chess_board(base_dir)
    board_dir = os.path.join(base_dir, 'board')
    while True:
        print(f"\n{current_player}'s turn:")
        print("Enter your move (e.g., 'E2 E4') or 'quit' to exit:")
        move = input("> ").strip()
        if move.lower() == 'quit':
            break
        try:
            start, end = move.split()
            if validate_move(board_dir, start, end):
                if move_piece(base_dir, start, end):
                    current_player = switch_player()
            else:
                print("Invalid move. Try again.")
        except ValueError:
            print("Invalid input. Please enter a move in the format 'E2 E4'.")

base_dir = r"./ChessGame"

command_line_interface(base_dir)

print(f"Chess board initialized in {os.path.join(base_dir, 'board')}")