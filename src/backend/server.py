from flask import Flask
from flask_cors import cross_origin
import json

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

@app.route("/getapl/<boardID>")
@cross_origin()
def getapl(boardID):
    board = Board.get(boardID)
    return json.dumps(board.calc_action_list())

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)