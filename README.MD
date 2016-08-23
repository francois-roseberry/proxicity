# Proxicity

Calculator of service proximity for homes

Server will be in nodejs, client will be javascript
Starting development, final objective is to display homes on a map, ranked by their proximity score

# Design outline

HomesProvider (provides homes and their addresses)

combined with

LandmarksProvider (provide close landmarks, like groceries, parks or restaurants)

-->

algorithm which calculates the distances and attributes scores

-->

client, which will display the points on a map