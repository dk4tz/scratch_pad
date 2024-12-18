from typing import List


def main():
    """find all the digits that add to the target"""
    print(f"Answser: {calculate_sum([2, 2, 3, 4, 1], 4)}")
    return


def calculate_sum(arr: List[int], target: int) -> List[int]:
    """
    track the combos
    dedup and sort
    [1, 2, 3, 4] --> 4
    def dfs(current_target, trail, current_idx):
        if current_target == 0:
            combos.append(trail[:])
            return

        for i in range(current_idx, len(arr)):
            if arr[i] > current_target:
                return
            t = current_target - arr[i]
            trail.append(arr[i])
            dfs(t, trail, i)
        return

    dfs(4, [], 0)
    return combos
    """

    combos = []
    sorted_set = sorted(set(arr))

    def dfs(current_target: int, trail: List[int], current_idx: int):
        if current_target == 0:
            combos.append(trail[:])
            return
        for i in range(current_idx, len(sorted_set)):
            if sorted_set[i] > current_target:
                break
            t = current_target - sorted_set[i]
            trail.append(sorted_set[i])
            dfs(t, trail, i)
            trail.pop()
        return

    dfs(target, [], 0)
    return combos


if __name__ == "__main__":
    main()
