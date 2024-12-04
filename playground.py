from typing import Dict, List, Optional, Set, Tuple, TypeAlias


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

    def find_node(self, start: Node, target: Node) -> Optional[List[Node]]:

        visited: Set[Node] = set()
        explore_stack: List[Tuple[Node, List[Node]]] = [(start, [start])]

        while explore_stack:
            current, path = explore_stack.pop()

            if current == target:
                return path
            if current not in visited:
                visited.add(current)

            for child in reversed(self.graph[current]):
                if child not in visited:
                    path_to_child = path + [child]
                    explore_stack.append((child, path_to_child))

        return []


def test_search() -> None:
    g = Graph()

    edges = [("A", "B"), ("A", "C"), ("B", "D"), ("B", "E"), ("C", "F")]

    for v1, v2 in edges:
        g.add_vertex(v1, v2)

    print("None") if not g.find_node("A", "C") else print(g.find_node("A", "C"))
    print("None") if not g.find_node("A", "D") else print(g.find_node("A", "D"))
    print("None") if not g.find_node("B", "F") else print(g.find_node("B", "F"))


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
