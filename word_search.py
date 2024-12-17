from typing import List


def exist(board: List[List[str]], target) -> bool:
    if not board or not target:
        return False

    rows = len(board)
    cols = len(board[0])
    path = set()

    def explore(row_idx, col_idx, target_idx) -> bool:
        if (
            row_idx < 0
            or row_idx >= rows
            or col_idx < 0
            or col_idx >= cols
            or (row_idx, col_idx) in path
            or board[row_idx][col_idx] != target[target_idx]
        ):
            return False

        if target_idx == len(target) - 1:
            return True

        path.add((row_idx, col_idx))
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

        for x, y in directions:
            if explore(row_idx + x, col_idx + y, target_idx + 1):
                return True

        path.remove((row_idx, col_idx))
        return False

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == target[0]:
                if explore(r, c, 0):
                    return True

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
