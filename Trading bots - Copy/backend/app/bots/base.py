class TradingBot:
    def __init__(self, name, config=None):
        self.name = name
        self.cash = 10000
        self.position = 0
        self.config = config or {}

    def decide(self, price, step):
        raise NotImplementedError

# Registry
available_bots = {}

def register_bot(name, cls):
    available_bots[name] = cls

def get_all_bot_names():
    return list(available_bots.keys())

def get_bot_class(name):
    return available_bots.get(name)
