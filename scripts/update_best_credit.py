import json
import os

path = os.path.join(os.path.dirname(__file__), "..", "cards.json")
path = os.path.abspath(path)

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

keep = [c for c in data["cards"] if c.get("category") != "best-credit"]

base = os.path.join(os.path.dirname(__file__), "..", "img", "logos", "Best Credit Cards")
files = [fn for fn in os.listdir(base) if os.path.isfile(os.path.join(base, fn))]
priority = ["payWave Visa Gold.jpg", "Visa Platinum.jpg", "Green Dot Visa Gold.png"]
remaining = sorted([fn for fn in files if fn not in priority])

def clean_name(filename: str) -> str:
    base = os.path.splitext(filename)[0]
    name = base.replace("_", " ").replace("PREVIEW", "").replace("CARDS", "")
    name = " ".join(name.split()).title()
    name = name.replace("Expres", "Express")
    return name

new = [
    {
        "id": "bc-1",
        "category": "best-credit",
        "name": "Paywave Visa Gold",
        "price": "A strong all-around card with premium perks.",
        "views": "2.8k",
        "rating": 4.8,
        "image": "img/logos/Best Credit Cards/payWave Visa Gold.jpg",
    },
    {
        "id": "bc-2",
        "category": "best-credit",
        "name": "Visa Platinum",
        "price": "Great for everyday spending and bonus categories.",
        "views": "2.1k",
        "rating": 4.6,
        "image": "img/logos/Best Credit Cards/Visa Platinum.jpg",
    },
    {
        "id": "bc-3",
        "category": "best-credit",
        "name": "Green Dot Visa Gold",
        "price": "Ideal for frequent travelers and flexible points.",
        "views": "1.9k",
        "rating": 4.5,
        "image": "img/logos/Best Credit Cards/Green Dot Visa Gold.png",
    },
]

labels = [
    "Signature",
    "Select",
    "Premier",
    "Elite",
    "Preferred",
    "Ultimate",
    "Classic",
    "Prime",
    "Reserve",
    "Advantage",
    "Rewards",
    "Plus",
    "Gold",
    "Platinum",
    "Infinity",
    "Summit",
]

idx = 4
for i, fn in enumerate(remaining):
    name = clean_name(fn)
    desc = "$0 annual fee" if i % 2 == 0 else "$95 annual fee"
    views = str(800 + i * 7)
    rating = round(4.0 + (i % 6) * 0.1, 1)
    new.append(
        {
            "id": f"bc-{idx}",
            "category": "best-credit",
            "name": name,
            "price": desc,
            "views": views,
            "rating": rating,
            "image": f"img/logos/Best Credit Cards/{fn}",
        }
    )
    idx += 1

data["cards"] = keep + new

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
