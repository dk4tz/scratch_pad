import math
from typing import List


def merge_sort(arr: List[int]) -> List[int]:
    """
    if we have one element, return it
    otherwise:
        calculate mid point
        take left and right and merge sort them

    initialize pointers for left and right
    initialize sorted_result

    while left pointer < len left and right pointer < len right:
        compare left and right
        if left <= right:
            append left
            incrememnt left
        else
            append right
            incremement right

    extend and cleanup
    """

    if len(arr) <= 1:
        return arr

    midpoint = len(arr) // 2
    left = arr[:midpoint]
    right = arr[midpoint:]

    sorted_left = merge_sort(left)
    sorted_right = merge_sort(right)

    pl = pr = 0
    merge_sorted = []

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
        print(f"array: {array}")
        print(f"result: {result}")
    else:
        print("Gahhh darn")
        print(f"expected: {expected}")
        print(f"result: {result}")
    return


if __name__ == "__main__":
    main()
