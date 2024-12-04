import math
from typing import List


def _merge_sort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    left = merge_sort(left)
    right = merge_sort(right)

    pl = 0
    pr = 0
    sorted_list = []

    while pl < len(left) and pr < len(right):
        if left[pl] <= right[pr]:
            sorted_list.append(left[pl])
            pl += 1
        else:
            sorted_list.append(right[pr])
            pr += 1

    sorted_list.extend(left[pl:])
    sorted_list.extend(right[pr:])

    return sorted_list


def merge_sort(arr: List[int]) -> List[int]:

    # base case - len(arr) <= 1 --> return arr
    if len(arr) <= 1:
        return arr

    # divide and conquer -> midpoint
    mid = len(arr) // 2
    sorted_left = merge_sort(arr[:mid])
    sorted_right = merge_sort(arr[mid:])

    sorted_list = []
    pr = pl = 0

    # while one pointer < length of corresponding array
    while pr < len(sorted_right) and pl < len(sorted_left):
        if sorted_right[pr] >= sorted_left[pl]:
            sorted_list.append(sorted_left[pl])
            pl += 1
        else:
            sorted_list.append(sorted_right[pr])
            pr += 1

    sorted_list.extend(sorted_right[pr:])
    sorted_list.extend(sorted_left[pl:])

    return sorted_list


def main() -> None:
    array = [4, 3, 2, 1, 2, 3, 4]
    result = merge_sort(array)
    expected = sorted(array)

    if result == expected:
        print("yay")
    else:
        print(f"array: {array}")
        print(f"sorted: {sorted}")
    return


if __name__ == "__main__":
    main()
