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
    """
    if lenght of array is 1, return the array (base case)

    midpoint = len(arr) // 2
    left = arr[:midpoint]
    right = arr[midpoint:]

    sorted_left = merge_sort(left)
    sorted_right = merge_sort(right)

    merged_sorted = []

    track pointers left and right
    while the left pointer less thand left length and right pointer less than right length:
        compare left at lp and right at rp
        if left at lp <= right at rp:
            merge_sorted.append(left at lp)
            lp ++
        else:
            merge _sroted.append(right at rp)
            rp ++

    cleanup by extending merge_sorted with stragglers from left and right

    """

    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2

    sorted_left = merge_sort(arr[:mid])
    sorted_right = merge_sort(arr[mid:])

    merge_sorted = []
    pl = pr = 0

    while pl < len(sorted_left) and pr < len(sorted_right):
        if sorted_left[pl] <= sorted_right[pr]:
            merge_sorted.append(sorted_left[pl])
            pl += 1
        else:
            merge_sorted.append(sorted_right[pr])
            pr += 1

    merge_sorted.extend(sorted_left[pl:])
    merge_sorted.extend(sorted_right[pr:])

    return merge_sorted


def main() -> None:
    array = [4, 3, 2, 1, 2, 3, 4, 88, 22, 99, 10, 1, 4]
    result = merge_sort(array)
    expected = sorted(array)

    if result == expected:
        print("yay")
        print(f"array: {result}")
        print(f"sorted: {expected}")
    else:
        print("Gahhh darn")
        print(f"array: {array}")
        print(f"sorted: {expected}")
    return


if __name__ == "__main__":
    main()
