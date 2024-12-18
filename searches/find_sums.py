from typing import List


def main():
    """find all the digits that add to the target"""
    print(f"Answser: {calculate_sum([2, 2, 3, 4], 4)}")
    return


def calculate_sum(arr: List[int], target: int) -> List[int]:

    sorted_set = sorted(set(arr))
    result = []

    def search_helper(target: int, trail: List[List[int]], idx: int) -> None:
        if target == 0:
            result.append(trail[:])
            return

        for i in range(idx, len(sorted_set)):
            if sorted_set[i] > target:
                break
            trail.append(sorted_set[i])
            t = target - sorted_set[i]
            search_helper(t, trail, i)
            trail.pop()

        return

    search_helper(target, [], 0)
    return result


if __name__ == "__main__":
    main()
