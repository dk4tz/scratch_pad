import math
from typing import List


def merge_sort(arr: List[int]) -> List[int]:
    # check if arr is 0 or 1 elements
    # return
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


def _merge_sort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr
    else:
        midpoint = math.floor(len(arr) / 2)
        left = merge_sort(arr[:midpoint])
        right = merge_sort(arr[midpoint:])

    sorted_full = []
    pointer_l = pointer_r = 0

    while pointer_l < len(left) and pointer_r < len(right):
        if left[pointer_l] < right[pointer_r]:
            sorted_full.append(left[pointer_l])
            pointer_l += 1
        else:
            sorted_full.append(right[pointer_r])
            pointer_r += 1

    sorted_full.extend(left[pointer_l:])
    sorted_full.extend(right[pointer_r:])

    return sorted_full


def main() -> None:
    array = [1, 5, 6, 8, 88, 3, 5, 1, 8, 90, 28, 45, 7, 99, 88, 77, 44444, 8, 3, 9200]
    sorted = merge_sort(array)
    print(array)
    print(sorted)
    return


if __name__ == "__main__":
    main()
