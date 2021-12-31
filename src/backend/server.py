from flask import Flask
from flask_cors import cross_origin

from board import Board

app = Flask(__name__)

@app.route("/start/<decks>")
@cross_origin()
def start_game(decks):
    board = Board(int(decks))
    return board.id


@app.route("/hit/<boardID>")
@cross_origin()
def hit(boardID):
    board = Board.get(boardID)
    if board:
        return board.hit()
    else:
        return 'purple_back'

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)