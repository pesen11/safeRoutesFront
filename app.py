from flask import Flask, render_template, request, jsonify
import googlemaps
import googlemaps.client
from routes import get_neighborhoods_from_routes
import requests

app = Flask(__name__)
API_KEY='API_KEY'
gmaps=googlemaps.Client(key=API_KEY)


@app.route('/')
def home():
    return render_template("home.html")

@app.route('/maps')
def maps():
    # Replace with your actual Google Maps API key
    google_maps_api_key = API_KEY
    return render_template('index.html', api_key=google_maps_api_key)

@app.route('/get_routes',methods=['POST'])
def get_routes():
    print("YOOHOOO")

    data = request.get_json()  # Get the JSON data sent from the frontend

    start_lat = data.get('lat')
    start_lng = data.get('lng')
    destination = data.get('destination')
    travelMode=data.get('travelMode')
    print(start_lat,start_lng,destination,travelMode)
    if start_lat is None or start_lng is None:
        return jsonify({'error': 'Latitude and Longitude are required'}), 400

    try:
        start_lat = float(start_lat)
        start_lng = float(start_lng)
    except ValueError:
        return jsonify({'error': 'Latitude and Longitude must be valid numbers'}), 400
    
    # Request possible routes from Google Maps API
    directions_result = gmaps.directions(
        (start_lat, start_lng),
        destination,
        mode=travelMode.lower(),
        alternatives=True
    )
    # print(directions_result)
    neighborhoods_by_route = get_neighborhoods_from_routes(directions_result)
    # Extract routes and coordinates
    routes = []
    for route in directions_result:
        route_coords = []
        for step in route['legs'][0]['steps']:
            end_location = step['end_location']
            route_coords.append([end_location['lat'], end_location['lng']])  
        routes.append(route_coords)

    print("Hello")
   
    url = "https://securestreetbackend-1.onrender.com/predict_routes"  # URL for the /predict_routes endpoint in modelDeployment.py
    response = requests.post(url, json={'neighborhoods_by_route': neighborhoods_by_route})
    print(response)

    if response.status_code == 200:
        predictions = response.json()  # Get the predictions from the response
        print(predictions)
        # Return the routes, neighborhoods, and predictions to the frontend (user)
        return jsonify({'routes': routes, 'neighborhoods': neighborhoods_by_route, 'predictions': predictions})
    else:
        return jsonify({'error': 'Error while predicting routes'}), 500
   

if __name__ == "__main__":
    app.run(debug=True)
