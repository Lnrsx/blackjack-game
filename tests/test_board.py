from src.backend import board
import re

test_board = board.Board(1)

def test_hand_value():
    # Makes sure valuation of hands is correct, as well as ace valuation
    assert test_board.value_hand(['6C', 'KH']) == 16
    assert test_board.value_hand(['2D', 'AH', 'KC']) == 13
    assert test_board.value_hand(['AC', 'AD', '7S', '10D', '2D']) == 21
    assert test_board.value_hand(['AC', '3H', 'AS', '6S']) == 21

def test_card_names():
    # Makes sure every card in the deck fits the naming convention
    for card in test_board.deck:
        assert bool(re.search("^[\dJKQA]+[HDCS]{1}$", card))

def test_apl():
    # Makes sure a new game will have a actions, 4 card deals and a player input
    len(test_board.calc_action_list()) == 5