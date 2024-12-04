from collections import deque
from dataclasses import dataclass
from typing import Deque, List, NamedTuple, Tuple, Optional


class TreeNode:
    def __init__(self, value: int):
        self.value = value
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


class QueueItem(NamedTuple):
    node1: TreeNode
    node2: TreeNode
    path: List[str]


@dataclass
class Divergence:
    node1: Optional[TreeNode]
    node2: Optional[TreeNode]
    path: Optional[List[str]]


def find_first_divergence(
    root1: Optional[TreeNode], root2: Optional[TreeNode]
) -> Optional[Divergence]:
    # check if root1 or root2 are none --> if so, return root and empty path
    if not root1 or not root2:
        return (root1, root2, [])

    search_queue: Deque[QueueItem] = deque([QueueItem(root1, root2, [])])
    # create a search queue of potential divergences --> queue = [(root1, root2, [])]

    # while there's a search queue
    while search_queue:
        # pop the next node from the queue
        current = search_queue.popleft()
        # if their values are different, we've found the divergence
        if current.node1.value != current.node2.value:
            return Divergence(current.node1, current.node2, current.path)

        # otherwise, search left and right children
        def search_children(
            c1: TreeNode, c2: TreeNode, direction: str
        ) -> Optional[Divergence]:
            path = current.path + direction
            if bool(c1) != bool(c2):
                return Divergence(c1, c2, path)
            else:
                search_queue.append(QueueItem(c1, c2, path))
            return None

        # helper function --> input root1.left and root2.left and 'left' --> return divergence or add to queue
        left_result = search_children(current.node1.left, current.node2.left, ["left"])
        if left_result:
            return left_result
        # helper function --> input root1.right and root2.right and 'right' --> return divergence or add to queue
        right_result = search_children(
            current.node1.right, current.node2.right, ["right"]
        )
        if right_result:
            return right_result
    return Divergence(None, None, [])


def create_tree(array: List[int]) -> Optional[TreeNode]:
    if len(array) < 1:
        return None
    root = TreeNode(array[0])
    pointer = 1

    tree_queue: Deque[TreeNode] = deque([root])

    # while we have a queue
    while tree_queue:
        next_up = tree_queue.popleft()
        if pointer < len(array) and array[pointer] is not None:
            next_up.left = TreeNode(array[pointer])
            pointer += 1
            tree_queue.append(next_up.left)
        if pointer < len(array) and array[pointer] is not None:
            next_up.right = TreeNode(array[pointer])
            pointer += 1
            tree_queue.append(next_up.right)

    return root


def main():
    print("hello world")
    larry = create_tree([1, 2, 5, 5, 6, 6, 2, 7, 8])
    david = create_tree([1, 2, 5, 5, 6, 6, 4, 7, 8])

    result = find_first_divergence(larry, david)
    print(result)
    return


if __name__ == "__main__":
    main()
