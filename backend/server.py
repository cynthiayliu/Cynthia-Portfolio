from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import random
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4

DATA_FILE = Path(__file__).with_name("data.json")
PORT = 8000


def load_data():
    with DATA_FILE.open("r", encoding="utf-8") as file:
        return normalize_data(json.load(file))


def slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", str(value).lower()).strip("-")
    return slug or uuid4().hex[:12]


def normalized_key(value):
    return re.sub(r"\s+", " ", str(value).strip().lower())


def normalize_data(data):
    if "trips" not in data:
        trip = data.get("trip") or {
            "destination": "Untitled trip",
            "departDate": "",
            "returnDate": "",
            "budget": 0,
        }
        trip = {**trip, "id": trip.get("id") or slugify(trip.get("destination"))}
        data["trips"] = [trip]
        data["activeTripId"] = trip["id"]

    if not data.get("activeTripId") and data["trips"]:
        data["activeTripId"] = data["trips"][0]["id"]

    active_trip_id = data.get("activeTripId")
    for item in data.get("items", []):
        item.setdefault("tripId", active_trip_id)
        item.setdefault("sourceUrl", "")

    data["trip"] = next(
        (trip for trip in data["trips"] if trip["id"] == data.get("activeTripId")),
        data["trips"][0] if data["trips"] else {},
    )
    return data


def save_data(data):
    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)
        file.write("\n")


def item_payload(payload):
    required = ["tripId", "category", "name", "currentPrice", "targetPrice", "date", "spots"]
    missing = [field for field in required if payload.get(field) in (None, "")]
    if missing:
        raise ValueError(f"Missing required field: {', '.join(missing)}")

    return {
        "id": payload.get("id") or uuid4().hex[:12],
        "tripId": str(payload["tripId"]),
        "category": str(payload["category"]),
        "name": str(payload["name"]),
        "source": str(payload.get("source") or "Manual watch"),
        "sourceUrl": str(payload.get("sourceUrl") or ""),
        "currentPrice": float(payload["currentPrice"]),
        "previousPrice": float(payload.get("previousPrice") or payload["currentPrice"]),
        "targetPrice": float(payload["targetPrice"]),
        "date": str(payload["date"]),
        "spots": int(payload["spots"]),
        "available": bool(payload.get("available", True)),
        "lastChecked": datetime.now().isoformat(timespec="seconds"),
    }


def item_duplicate_key(item):
    return (
        item.get("tripId"),
        item.get("category"),
        normalized_key(item.get("name", "")),
        normalized_key(item.get("source", "")),
        item.get("date"),
    )


def has_duplicate_item(items, candidate, exclude_id=None):
    candidate_key = item_duplicate_key(candidate)
    return any(
        item.get("id") != exclude_id and item_duplicate_key(item) == candidate_key
        for item in items
    )


def refresh_item(item):
    refreshed = dict(item)
    refreshed["previousPrice"] = item["currentPrice"]
    movement = random.uniform(-0.09, 0.07)
    refreshed["currentPrice"] = max(0, round(item["currentPrice"] * (1 + movement), 2))
    if random.random() > 0.82:
        refreshed["available"] = not item.get("available", True)
    if refreshed["available"]:
        refreshed["spots"] = max(1, int(item.get("spots", 1)) + random.choice([-1, 0, 0, 1]))
    else:
        refreshed["spots"] = 0
    refreshed["lastChecked"] = datetime.now().isoformat(timespec="seconds")
    return refreshed


def trip_payload(payload, existing_id=None):
    destination = str(payload.get("destination") or "Untitled trip")
    return {
        "id": existing_id or payload.get("id") or slugify(destination),
        "destination": destination,
        "departDate": str(payload.get("departDate", "")),
        "returnDate": str(payload.get("returnDate", "")),
        "budget": float(payload.get("budget") or 0),
    }


def trip_duplicate_key(trip):
    return (
        normalized_key(trip.get("destination", "")),
        trip.get("departDate"),
        trip.get("returnDate"),
    )


def has_duplicate_trip(trips, candidate, exclude_id=None):
    candidate_key = trip_duplicate_key(candidate)
    return any(
        trip.get("id") != exclude_id and trip_duplicate_key(trip) == candidate_key
        for trip in trips
    )


def trip_summary(trip, items):
    trip_items = [item for item in items if item.get("tripId") == trip["id"]]
    return {
        **trip,
        "itemCount": len(trip_items),
        "alertCount": len([item for item in trip_items if item.get("available") and item["currentPrice"] <= item["targetPrice"]]),
        "totalWatched": round(sum(float(item["currentPrice"]) for item in trip_items), 2),
    }


class Handler(BaseHTTPRequestHandler):
    def _json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length == 0:
            return {}
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_OPTIONS(self):
        self._json(204, {})

    def do_GET(self):
        path = urlparse(self.path).path
        data = load_data()
        if path == "/api/health":
            self._json(200, {"ok": True})
        elif path == "/api/trips":
            self._json(200, [trip_summary(trip, data["items"]) for trip in data["trips"]])
        elif path == "/api/trip":
            self._json(200, data["trip"])
        elif path == "/api/items":
            self._json(200, data["items"])
        else:
            self._json(404, {"error": "Not found"})

    def do_POST(self):
        path = urlparse(self.path).path
        data = load_data()
        try:
            if path == "/api/items":
                item = item_payload(self._read_body())
                if has_duplicate_item(data["items"], item):
                    self._json(409, {"error": "That watch is already on this trip."})
                    return
                data["items"].append(item)
                save_data(data)
                self._json(201, item)
            elif path == "/api/trips":
                trip = trip_payload(self._read_body())
                if has_duplicate_trip(data["trips"], trip):
                    self._json(409, {"error": "That trip already exists."})
                    return
                existing_ids = {existing["id"] for existing in data["trips"]}
                if trip["id"] in existing_ids:
                    trip["id"] = f"{trip['id']}-{uuid4().hex[:4]}"
                data["trips"].append(trip)
                data["activeTripId"] = trip["id"]
                data["trip"] = trip
                save_data(data)
                self._json(201, trip_summary(trip, data["items"]))
            elif path == "/api/refresh":
                data["items"] = [refresh_item(item) for item in data["items"]]
                save_data(data)
                self._json(200, data["items"])
            else:
                self._json(404, {"error": "Not found"})
        except ValueError as error:
            self._json(400, {"error": str(error)})

    def do_PUT(self):
        path = urlparse(self.path).path
        data = load_data()
        trip_match = re.fullmatch(r"/api/trips/([^/]+)", path)
        if path == "/api/trip":
            payload = self._read_body()
            data["trip"] = trip_payload(payload, data.get("activeTripId"))
            if has_duplicate_trip(data["trips"], data["trip"], data["trip"]["id"]):
                self._json(409, {"error": "That trip already exists."})
                return
            data["trips"] = [
                data["trip"] if trip["id"] == data["trip"]["id"] else trip
                for trip in data["trips"]
            ]
            save_data(data)
            self._json(200, data["trip"])
        elif trip_match:
            trip_id = trip_match.group(1)
            payload = self._read_body()
            updated = trip_payload(payload, trip_id)
            if has_duplicate_trip(data["trips"], updated, trip_id):
                self._json(409, {"error": "That trip already exists."})
                return
            found = False
            data["trips"] = [
                updated if trip["id"] == trip_id else trip
                for trip in data["trips"]
            ]
            found = any(trip["id"] == trip_id for trip in data["trips"])
            if not found:
                self._json(404, {"error": "Trip not found"})
                return
            if data.get("activeTripId") == trip_id:
                data["trip"] = updated
            save_data(data)
            self._json(200, trip_summary(updated, data["items"]))
        else:
            self._json(404, {"error": "Not found"})

    def do_DELETE(self):
        path = urlparse(self.path).path
        data = load_data()
        bulk_match = re.fullmatch(r"/api/items", path)
        item_match = re.fullmatch(r"/api/items/([^/]+)", path)
        trip_match = re.fullmatch(r"/api/trips/([^/]+)", path)
        if trip_match:
            trip_id = trip_match.group(1)
            if len(data["trips"]) <= 1:
                self._json(400, {"error": "Keep at least one trip."})
                return
            if not any(trip["id"] == trip_id for trip in data["trips"]):
                self._json(404, {"error": "Trip not found"})
                return
            data["trips"] = [trip for trip in data["trips"] if trip["id"] != trip_id]
            data["items"] = [item for item in data["items"] if item.get("tripId") != trip_id]
            if data.get("activeTripId") == trip_id:
                data["activeTripId"] = data["trips"][0]["id"]
            data["trip"] = next(trip for trip in data["trips"] if trip["id"] == data["activeTripId"])
            save_data(data)
            self._json(200, {
                "trips": [trip_summary(trip, data["items"]) for trip in data["trips"]],
                "activeTrip": data["trip"],
                "items": data["items"],
            })
            return
        if bulk_match:
            payload = self._read_body()
            ids = set(payload.get("ids", []))
            trip_id = payload.get("tripId")
            mode = payload.get("mode")

            def should_remove(item):
                if ids:
                    return item["id"] in ids
                if trip_id and item.get("tripId") != trip_id:
                    return False
                if mode == "unavailable":
                    return not item.get("available", True)
                if mode == "alerts":
                    return item.get("available") and item["currentPrice"] <= item["targetPrice"]
                if mode == "visible":
                    return True
                return False

            before = len(data["items"])
            data["items"] = [item for item in data["items"] if not should_remove(item)]
            save_data(data)
            self._json(200, {"removed": before - len(data["items"]), "items": data["items"]})
            return
        if not item_match:
            self._json(404, {"error": "Not found"})
            return
        item_id = item_match.group(1)
        data["items"] = [item for item in data["items"] if item["id"] != item_id]
        save_data(data)
        self._json(204, {})

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"TripSignal API running at http://127.0.0.1:{PORT}")
    server.serve_forever()
