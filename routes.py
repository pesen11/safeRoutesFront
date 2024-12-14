import googlemaps

# Initialize Google Maps API
gmaps = googlemaps.Client(key='AIzaSyBowpT2q3WA66xsVeX6a5eqMN4uWeo4ciI')

def get_neighborhoods_from_routes(directions_result):
    neighborhoods_by_route = []

    # Loop through each route in the directions result
    for route_index, route in enumerate(directions_result):
        neighborhoods = []  # Reset neighborhoods for the current route
        for step in route['legs'][0]['steps']:
            end_location = step['end_location']
            reverse_geocode_result = gmaps.reverse_geocode((end_location['lat'], end_location['lng']))
            for result in reverse_geocode_result:
                for component in result['address_components']:
                    if 'neighborhood' in component['types']:
                        neighborhoods.append(component['long_name'])

        # Store unique neighborhoods as a list (not a set) for the current route
        neighborhoods_by_route.append(list(set(neighborhoods)))  # Convert to list after removing duplicates

    return neighborhoods_by_route
