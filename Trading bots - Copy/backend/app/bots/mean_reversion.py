# app/bots/mean_reversion.py

from app.bots.base import TradingBot, register_bot

class MeanReversionBot(TradingBot):
    def decide(self, price, step):
        # Simple mean reversion logic
        if price < 100:
            self.position += 1
            self.cash -= price
        elif price > 105 and self.position > 0:
            self.position -= 1
            self.cash += price

register_bot("mean_reversion", MeanReversionBot)
