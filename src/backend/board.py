import random
import uuid
import re

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

        self.id = str(uuid.uuid1().hex)[:6]
        self.player_hand = []
        self.dealer_hand = []

    @classmethod
    def get(cls, id):
        for board in cls.boards:
            if id == board.id:
                return board

    def hit(self):
        card = str(self.deck.pop())
        self.player_hand.append(card)
        return card

    def value_hand(self, hand):
        points = 0
        aces = 0
        for card in hand:
            value = re.findall('^[\dJKQA]+', card)[0]
            if value.isnumeric():
                points += int(value)
                continue
            elif value in ['J', 'K', 'Q']:
                points += 10
                continue
            elif value == 'A':
                points += 11
                aces += 1
        while points > 21 and aces > 0:
            aces -= 1
            points -= 10
        return points
    
    def calc_action_list(self, action_list = []):
        # Deals cards to the dealer and player until they both have 2 card
        if len(self.player_hand) < 2 or len(self.dealer_hand) < 2:
            if len(self.player_hand) < 2:
                card = self.deck.pop()
                self.player_hand.append(card)
                action_list.append({
                    "action": "deal",
                    "unit": "player",
                    "card": card,
                })
            if len(self.dealer_hand) < 2:
                card = self.deck.pop()
                self.dealer_hand.append(card)
                action_list.append({
                    "action": "deal",
                    "unit": "dealer",
                    "card": card,
                })
            self.calc_action_list(action_list = action_list)
        
