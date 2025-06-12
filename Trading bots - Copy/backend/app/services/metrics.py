def compute_metrics(portfolio):
    if not portfolio or len(portfolio) < 2:
        return {
            "final_value": portfolio[-1] if portfolio else 0,
            "sharpe_ratio": 0,
            "volatility": 0,
            "max_drawdown": 0
        }

    final_value = portfolio[-1]

    # Daily returns
    returns = [
        (portfolio[i] - portfolio[i - 1]) / portfolio[i - 1]
        for i in range(1, len(portfolio))
    ]

    # Mean and volatility
    mean_return = sum(returns) / len(returns)
    variance = sum((r - mean_return) ** 2 for r in returns) / len(returns)
    volatility = variance ** 0.5

    # Sharpe ratio (assume 0% risk-free rate)
    sharpe = mean_return / volatility if volatility > 0 else 0

    # Max drawdown
    peak = portfolio[0]
    drawdowns = []
    for value in portfolio:
        peak = max(peak, value)
        drawdown = (peak - value) / peak
        drawdowns.append(drawdown)
    max_drawdown = max(drawdowns)

    return {
        "final_value": final_value,
        "sharpe_ratio": sharpe,
        "volatility": volatility,
        "max_drawdown": max_drawdown
    }
