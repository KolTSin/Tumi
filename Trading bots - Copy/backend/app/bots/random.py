import random
from app.bots.base import TradingBot, register_bot

class RandomBot(TradingBot):
    def decide(self, price, step):
        action = random.choice(["buy", "sell", "hold"])
        if action == "buy" and self.cash >= price:
            self.position += 1
            self.cash -= price
        elif action == "sell" and self.position > 0:
            self.position -= 1
            self.cash += price

register_bot("random", RandomBot)
