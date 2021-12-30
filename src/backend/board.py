import random
import uuid

suits = ['C', 'S', 'H', 'D']
values = [str(i) for i in range(2, 11)] + ['J', 'K', 'Q', 'A']


class Board(object):
    boards = []

    def __init__(self, deck_count: int):
        self.__class__.boards.append(self)
        self.deck = []
        for _ in range(deck_count):
            for suit in suits:
                for value in values:
                    self.deck.append(value + suit)
        random.shuffle(self.deck)
        self.id = str(uuid.uuid1().int)[:10]

    def deal_card(self):
        return str(self.deck.pop())