from typing import Dict, List, Optional, Set, Tuple, TypeAlias

from collections import deque


class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


def is_it_a_bst(root: TreeNode) -> bool:
    def validate_bst(
        node: TreeNode, min_value=float("-inf"), max_value=float("inf")
    ) -> bool:
        if not node:
            return True
        if not min_value < node.value < max_value:
            return False

        left_valid = validate_bst(node.left, min_value=min_value, max_value=node.value)
        right_valid = validate_bst(
            node.right, min_value=node.value, max_value=max_value
        )

        return left_valid and right_valid

    return validate_bst(root)


Node: TypeAlias = str


class Graph:
    def __init__(self):
        self.graph: Dict[Node, Optional[List[Node]]] = {}

    def add_vertex(self, v1: Node, v2: Node) -> None:
        if v1 not in self.graph:
            self.graph[v1] = []
        if v2 not in self.graph:
            self.graph[v2] = []
        self.graph[v1].append(v2)

    def find_node_bfs(self, start: Node, target: Node) -> Optional[List[Node]]:
        if start not in self.graph or target not in self.graph:
            return None
        if start == target:
            return [start]

        visited = {start}
        search_queue = deque([(start, [start])])

        while search_queue:
            node, path = search_queue.popleft()

            for child in reversed(self.graph[node]):
                if child == target:
                    return path + [child]

                if child not in visited:
                    visited.add(child)
                    child_path = path + [child]
                    search_queue.append((child, child_path))

        return None

    def find_node_dfs(self, start: Node, target: Node) -> Optional[List[Node]]:
        """
        is start the target?
        is start or target None?

        track visited
        perform recursive dfs on start

        recursive dfs (node, target, path)
        have we visited the node?
        nope, is node the target?
            yes return path + [node] ## base case
        nope, iterate through neighbors
        recursive dfs on neighbor

        is neighbor target? --> return
        nope, run find_node_dfs -->

        """

        if start == target:
            return [start]
        if not start or not target:
            return None
        if start not in self.graph or target not in self.graph:
            return None

        visited = {start}
        path = [start]

        def recursive_dfs(node, target, path):
            visited.add(node)
            for child in self.graph[node]:
                if child == target:
                    return path + [child]
                if child not in visited:
                    result = recursive_dfs(child, target, path + [child])
                    if result:
                        return result
            return None

        return recursive_dfs(start, target, path)


def test_search() -> None:
    g = Graph()

    edges = [("A", "B"), ("A", "C"), ("B", "D"), ("B", "E"), ("C", "F")]

    for v1, v2 in edges:
        g.add_vertex(v1, v2)

    print("None") if not g.find_node_bfs("A", "C") else print(g.find_node_bfs("A", "C"))
    print("None") if not g.find_node_bfs("A", "D") else print(g.find_node_bfs("A", "D"))
    print("None") if not g.find_node_bfs("B", "F") else print(g.find_node_bfs("B", "F"))


def main() -> None:
    test_search()
    # invalid_bst = TreeNode(5)
    # invalid_bst.left = TreeNode(7)  # This is bigger than 5!
    # invalid_bst.right = TreeNode(1)  # This is smaller than 5!
    # invalid_bst.left.left = TreeNode(1)
    # invalid_bst.left.right = TreeNode(4)
    # print(is_it_a_bst(invalid_bst))


if __name__ == "__main__":
    main()
