"""
We finna calculate most water in container no cap.
"""

from typing import List


def calculate_most_water(heights: List[int]) -> int:
    """
    initialize pointers (left = 0, right = len(heights) - 1)
    initialize max volume

    while left < right:
    width = right - left
    height = min(heights at index right, left)
    vol = width * height

    if vol > max_vol:
    update max_vol

    if left <= right --> increment left
    otherwise decrement right
    return max vol
    """

    left, right = 0, len(heights) - 1
    max_vol = 0

    while left < right:
        width = right - left
        height = min(heights[left], heights[right])
        vol = width * height
        max_vol = max(max_vol, vol)

        if heights[left] <= heights[right]:
            left += 1
        else:
            right -= 1

    return max_vol


def main() -> None:
    heights1 = [2, 1, 2, 1, 1, 4]  # expected result = 10
    heights2 = [1, 8, 1, 1, 8, 4]  # expected result = 24
    print(calculate_most_water(heights2))
    return


if __name__ == "__main__":
    main()
