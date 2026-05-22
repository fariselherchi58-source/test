from __future__ import annotations
import networkx as nx
from shapely.geometry import LineString, shape
from app.models.schemas import WorkArea

class TaxiRouter:
    """A tiny demo graph. Replace with full EHAM taxiway graph from PostGIS/OSM."""

    def __init__(self) -> None:
        self.graph = nx.Graph()
        self._seed()

    def _seed(self) -> None:
        nodes = {
            'A': (4.7600, 52.3090),
            'B': (4.7650, 52.3100),
            'C': (4.7700, 52.3120),
            'D': (4.7760, 52.3140),
            'E': (4.7550, 52.3050),
            'F': (4.7480, 52.3010),
        }
        for name, xy in nodes.items():
            self.graph.add_node(name, xy=xy)
        edges = [('A','B'),('B','C'),('C','D'),('E','B'),('F','E')]
        for u, v in edges:
            self.graph.add_edge(u, v, weight=1.0)

    def route(self, start: str, end: str, work_areas: list[WorkArea]) -> list[list[float]]:
        g = self.graph.copy()
        closed = [shape(a.geometry) for a in work_areas if a.restriction == 'closed']
        for u, v in list(g.edges):
            line = LineString([g.nodes[u]['xy'], g.nodes[v]['xy']])
            if any(poly.intersects(line) for poly in closed):
                g[u][v]['weight'] = 9999
        path = nx.shortest_path(g, start, end, weight='weight')
        return [list(g.nodes[n]['xy']) for n in path]

taxi_router = TaxiRouter()
