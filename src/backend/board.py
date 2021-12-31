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
        self.player_standing = False
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
            return self.calc_action_list(action_list = action_list)

        # Checks if the player has more than 21 in their hadn
        if self.value_hand(self.player_hand) > 21:
            # dealer wins
            action_list.append({
                "action": "end",
                "winner": "dealer"
            })
            return action_list
        # checks if player has 21 in their hand
        if self.value_hand(self.player_hand) == 21:
            # checks if dealer also has 21 in their hand
            if self.value_hand(self.dealer_hand) == 21:
                # draw
                action_list.append({
                    "action": "end",
                    "winner": "draw"
                })
                return action_list
            # otherwise dealer does not have 21 in their hand (over or under 21 would still make the player win)
            else:
                # player wins
                action_list.append({
                    "action": "end",
                    "winner": "player"
                })
                return action_list
        
        # If the player has not yet stood, they must take an action (no more actions can be decided until after the decision)
        if not self.player_standing:
            action_list.append({
                "action": "player_turn",
            })
            return action_list
        # If the player has stood, the only actions left to take are for the dealer to draw
        else:
            # The dealer must draw if their hand is valued below 17
            if self.value_hand(self.dealer_hand) < 17:
                card = self.deck.pop()
                self.dealer_hand.append(card)
                action_list.append({
                    "action": "deal",
                    "unit": "dealer",
                    "card": card,
                })
            # If their hand if 17 or over, they must stand. The winner can then be decided
            else:
                if self.value_hand(self.player_hand) > self.value_hand(self.dealer_hand):
                    # Player wins
                    action_list.append({
                    "action": "end",
                    "winner": "player"
                    })
                    return action_list
                if self.value_hand(self.player_hand) < self.value_hand(self.dealer_hand):
                    # Dealer wins
                    action_list.append({
                    "action": "end",
                    "winner": "dealer"
                    })
                    return action_list
                else:
                    # Draw
                    action_list.append({
                        "action": "end",
                        "winner": "draw"
                    })
                    return action_list