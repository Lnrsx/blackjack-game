from src.backend import board
import re

test_board = board.Board(1)

def test_hand_value():
    assert test_board.value_hand(['6C', 'KH']) == 16
    assert test_board.value_hand(['2D', 'AH', 'KC']) == 13
    assert test_board.value_hand(['AC', 'AD', '7S', '10D', '2D']) == 21

def test_card_names():
    for card in test_board.deck:
        assert bool(re.search("^[\dJKQA]+[HDCS]{1}$", card))