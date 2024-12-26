from typing import List, Tuple


def exist(board: List[List[str]], target) -> bool:
    visited = set()

    if not target or not board:
        return False

    def dfs(position: Tuple[int], current_idx: int):
        if current_idx == len(target):
            return True

        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        current_x, current_y = position

        for x, y in directions:
            next_x = current_x + x
            next_y = current_y + y

            if (
                next_x >= len(board)
                or next_y >= len(board[0])
                or next_x < 0
                or next_y < 0
            ):
                continue

            if (next_x, next_y) in visited or board[next_x][next_y] != target[
                current_idx
            ]:
                continue
            visited.add((next_x, next_y))
            if dfs((next_x, next_y), current_idx + 1):
                return True
            visited.remove((next_x, next_y))
        return False

    for r in range(len(board)):
        for c in range(len(board[0])):
            if board[r][c] == target[0]:
                visited.add((r, c))
                if dfs((r, c), 1):
                    return True
                visited.remove((r, c))

    return False


def test_word_search():
    # Test case 1: Basic positive case
    board1 = [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]]
    assert exist(board1, "ABCCED") == True
    assert exist(board1, "SEE") == True
    assert exist(board1, "ABCB") == False

    # Test case 2: Single character board
    board2 = [["A"]]
    assert exist(board2, "A") == True
    assert exist(board2, "B") == False

    # Test case 3: Empty board or word
    assert exist([], "ABC") == False
    assert exist([["A"]], "") == False

    print("All test cases passed!")


if __name__ == "__main__":
    test_word_search()
