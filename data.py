## Given an array s and window k, calculate the largest sum of integers

from typing import List, Optional


class ListNode:
    def __init__(self, value):
        self.value: int = value
        self.next: Optional[ListNode] = None


def calculate(arr: List[int], k: int) -> Optional[int]:
    # edge cases
    if not arr or len(arr) < k:
        return None
    # calculate sum of arr[:k]
    current = sum(arr[:k])
    max_sum = current
    # for element in range(k, len(arr) - 1):
    for index in range(k, len(arr)):
        current = current - arr[index - k] + arr[index]
        max_sum = max(max_sum, current)

    return max_sum


def create_linked_list(values: List[int]) -> Optional[ListNode]:
    if not values:
        return None

    head = ListNode(values[0])
    current = head

    for i in range(1, len(values)):
        current.next = ListNode(values[i])
        current = current.next

    return head


def unpack_linked_list(head: ListNode) -> List[int]:
    unpacked = []
    current = head

    while current:
        unpacked.append(current.value)
        current = current.next

    return unpacked


def reverse(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head:
        return None

    tail = None
    current = head

    while current:
        forward = current.next
        current.next = tail

        tail = current
        current = forward

    return tail


if __name__ == "__main__":
    # print(calculate([1, 2, 3, 4, 8, 2, 2, 1, 9, 2], 4))
    test = create_linked_list([1, 2, 3, 4])
    reversed_list = reverse(test)
    print(unpack_linked_list(reversed_list))
