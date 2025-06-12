from app.simulation.market import generate_market_series
from app.bots.base import get_bot_class
from app.services.metrics import compute_metrics
from statistics import mean, stdev

def simulate_single_bot(bot_name, prices, params=None):
    BotClass = get_bot_class(bot_name)
    if not BotClass:
        raise ValueError(f"Bot '{bot_name}' not found")

    bot = BotClass(bot_name, config=params)
    portfolio = []

    for step, price in enumerate(prices):
        bot.decide(price, step)
        value = bot.cash + bot.position * price
        portfolio.append(value)

    return portfolio


def run_multiple_simulations(bot_name, steps=100, runs=10):
    all_runs = []
    for _ in range(runs):
        prices = generate_market_series(steps)
        portfolio = simulate_single_bot(bot_name, prices)
        all_runs.append(portfolio)

    # Compute average of last values, average Sharpe, etc.
    metrics = aggregate_metrics(all_runs)
    return {
        "trajectories": all_runs,
        "metrics": metrics
    }

def aggregate_metrics(runs):

    finals = [run[-1] for run in runs]
    sharpes = []
    volatilities = []
    drawdowns = []

    for run in runs:
        m = compute_metrics(run)
        sharpes.append(m["sharpe_ratio"])
        volatilities.append(m["volatility"])
        drawdowns.append(m["max_drawdown"])

    return {
        "mean_final": mean(finals),
        "std_final": stdev(finals),
        "mean_sharpe": mean(sharpes),
        "mean_volatility": mean(volatilities),
        "mean_drawdown": mean(drawdowns)
    }
