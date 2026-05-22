[out:json][timeout:60];
area["iata"="AMS"]->.airport;
(
  way(area.airport)["aeroway"~"runway|taxiway|apron|parking_position|gate"];
  relation(area.airport)["aeroway"~"runway|taxiway|apron|parking_position|gate"];
  node(area.airport)["aeroway"~"gate|parking_position"];
);
out body;
>;
out skel qt;
