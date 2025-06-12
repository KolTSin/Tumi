from flask import Blueprint, request, jsonify
from app.simulation.engine import run_multiple_simulations, simulate_single_bot
from app.bots.base import get_all_bot_names
from app.simulation.market import generate_market_series
from app.services.metrics import compute_metrics

api_blueprint = Blueprint("api", __name__)

@api_blueprint.route("/bots", methods=["GET"])
def list_bots():
    return jsonify(get_all_bot_names())

@api_blueprint.route("/simulate", methods=["POST"])
def simulate():
    data = request.get_json()
    bot_names = data.get("bots", [])
    config = data.get("config", {})
    steps = config.get("steps", 100)
    runs = config.get("runs", 10)

    if not bot_names:
        return jsonify({"error": "No bots specified"}), 400

    results = {}
    for bot in bot_names:
        try:
            sim = run_multiple_simulations(bot["name"].lower().replace(" ","_"), steps=steps, runs=runs)
            results[bot["name"]] = sim
        except Exception as e:
            results[bot["name"]] = {"error": str(e)}

    return jsonify(results)


@api_blueprint.route("/scenario", methods=["POST"])
def scenario():
    data = request.get_json()
    market_config = data.get("market", {})
    bots = data.get("bots", [])

    steps = market_config.get("steps", 100)
    runs = market_config.get("runs", 100)

    results = {}
    all_bots = list_bots()

    for bot in bots:
        name = bot.get("name")
        label = bot.get("label", name)
        params = bot.get("params", {})

        trajectories = []
        final_returns = []

        for _ in range(runs):
            try:
                prices = generate_market_series(steps, market_config)
                trajectory = simulate_single_bot(name, prices, params)
                trajectories.append(trajectory)
                initial_value = trajectory[0]
                final_value = trajectory[-1]
                final_returns.append(final_value / initial_value - 1)
            except Exception as e:
                results[label] = {"error": str(e)}
                break

        if label not in results:
            metrics = compute_metrics(trajectories[0])  # use first trajectory for metrics
            results[label] = {
                "trajectory": trajectories[0],
                "metrics": metrics,
                "returns": final_returns
            }

    return jsonify(results)

