from app.bots.base import TradingBot, register_bot

class MomentumBot(TradingBot):
    def __init__(self, name, config=None):
        super().__init__(name, config)
        self.window = self.config.get('window', 5)
        self.threshold = self.config.get('threshold', 1.0)
        self.price_history = []

    def decide(self, price, step):
        self.price_history.append(price)
        if len(self.price_history) < self.window + 1:
            return

        trend = price - self.price_history[-self.window - 1]
        if trend > self.threshold and self.cash >= price:
            self.position += 1
            self.cash -= price
        elif trend < -self.threshold and self.position > 0:
            self.position -= 1
            self.cash += price

register_bot("momentum", MomentumBot)
