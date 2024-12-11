"""
Create a graph and use breadth first search and depth first search to search it.

Instantiate the graph class
- Init
- Add nodes
- Search_DFS
- Search_BFS

main loop
instantiate nodes
instatiate our graph
for node in nodes --> add to graph

target = 'T'

bfs_found = Graph.search_bfs(target)
dfs_found = Graph.search_dfs(target)
"""

from collections import defaultdict, deque
from typing import Deque, Dict, List, Optional, Set, Tuple


class Graph:
    def __init__(self) -> None:
        self.connections: Dict[str, List[str]] = defaultdict()

    def add_node(self, node1, node2) -> bool:
        if type(node1) is not str or type(node2) is not str:
            print("Invalid node spec. We only take strings.")
            return False
        else:
            if not self.connections.get(node1, None):
                self.connections[node1] = []
            if not self.connections.get(node2, None):
                self.connections[node2] = []
            self.connections[node1].append(node2)
            return True

    def bfs(self, start, target) -> Tuple[bool, List]:
        if not isinstance(start, str) or not isinstance(target, str):
            print("Invalid")
            return False
        if start not in self.connections.keys():
            print("Start has no children")
            return False

        visited: Set[str] = set()
        search_que: Deque[Tuple[str, List[str]]] = deque([(start, [start])])

        while search_que:
            current_node, current_path = search_que.popleft()
            print(f"Current: {current_node, current_path}")
            if current_node == target:
                return True
            if current_node not in visited:
                visited.add(current_node)
                for child in self.connections.get(current_node, []):
                    search_que.append((child, current_path + [child]))

        return False, []

    def dfs(self, start, target) -> Tuple[bool, List]:
        "DFS using recursion"
        if not isinstance(start, str) or not isinstance(target, str):
            print("Invalid")
            return False
        if start not in self.connections.keys():
            print("Start has no children")
            return False

        visited: Set[str] = set()
        path: List[str] = []

        def dfs_helper(node) -> bool:
            print(f"Current: {node, path}")
            path.append(node)
            if node == target:
                return True
            if node not in visited:
                visited.add(node)
                for child in self.connections.get(node, []):
                    if dfs_helper(child):
                        return True
            path.pop()
            return False

        found = dfs_helper(start)
        return found, path if found else []

    def dfs_que(self, start, target):
        """
        DFS using que
        """

        visited: Set[str] = set()
        search_que: Deque[str] = [start]
        path: List[str] = [start]

        while search_que:
            current = search_que.pop()
            print(f"Current: {current}")
            if current == target:
                return True, path
            if current not in visited:
                visited.add(current)
                search_que.extend(self.connections.get(current, []))
        return False


if __name__ == "__main__":
    graph = Graph()
    nodes: List[Tuple[str, str]] = [
        ("A", "B"),
        ("B", "C"),
        ("A", "D"),
        ("A", "E"),
        ("E", "T"),
    ]

    for node1, node2 in nodes:
        result = graph.add_node(node1, node2)
        if not result:
            print(f"Failed adding {node1}, {node2}")
        else:
            print(f"Success!")

    found_bfs = graph.bfs("A", "T")
    print(found_bfs)

    found_dfs = graph.dfs("A", "T")
    print(found_dfs)
