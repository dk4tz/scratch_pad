## randomize an array in place

##
"""
input = List[sr]
output = List[str]
function = manual shuffle

loop through the input from front to back
move element to idx 1 through element idx -1
return shuffled

"""

from typing import List
from random import randrange


def manual_shuffle(arr: List[str]):

    shuffled = arr.copy()

    for i in range(len(arr), 0, -1):
        rand_idx = randrange(0, i)
        shuffled[i - 1], shuffled[rand_idx] = shuffled[rand_idx], shuffled[i - 1]

    return shuffled


def main() -> None:
    test = [1, 2, 3, 4, 5, 9]
    print(test)
    randomized = manual_shuffle(test)
    print(randomized)
    return


if __name__ == "__main__":
    main()
