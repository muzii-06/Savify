import sys
import json
import xgboost as xgb
import pandas as pd
import os

try:
    model_path = os.path.join(os.path.dirname(__file__), "xgb_discount_model.json")
    model = xgb.Booster()
    model.load_model(model_path)
except Exception as e:
    print(json.dumps({"error": f"Failed to load model: {str(e)}"}))
    sys.exit(1)

try:
    input_data = sys.stdin.read()
    params = json.loads(input_data)

    age = int(params.get('account_age_days'))
    orders = int(params.get('total_orders'))
    rating = float(params.get('product_rating'))
    max_discount = float(params.get('max_discount'))

    data = pd.DataFrame([{
        'account_age_days': age,
        'total_orders': orders,
        'product_rating': rating
    }])

    dmatrix = xgb.DMatrix(data)
    prediction = model.predict(dmatrix)[0]

    final_discount = min(prediction, max_discount)
    print(json.dumps({ "discount": float(round(final_discount, 2)) }))

except Exception as e:
    print(json.dumps({ "error": str(e) }))
    sys.exit(1)
