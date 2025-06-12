import random

def generate_market_series(steps=100, config=None):
    config = config or {}
    start = config.get("start", 100)
    volatility = config.get("volatility", 1.0)
    trend = config.get("trend", 0.0)

    prices = [start]
    for _ in range(steps):
        drift = trend
        shock = random.uniform(-volatility, volatility)
        prices.append(prices[-1] + drift + shock)
    return prices
