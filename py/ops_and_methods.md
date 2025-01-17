# Essential Python Methods and Operations Guide

## String Operations

String methods are fundamental to text processing and manipulation. The most crucial ones to remember:

### Core String Methods

```python
text = "Hello, World!"
text.lower()       # Convert to lowercase
text.upper()       # Convert to uppercase
text.strip()       # Remove whitespace from both ends
text.split(",")    # Split string into list at delimiter
"".join(["a","b"]) # Join list elements with delimiter
```

### String Searching

```python
text.find("World")      # Get index of substring (or -1)
text.replace("o", "0")  # Replace all occurrences
text.startswith("He")   # Check prefix
text.endswith("!")      # Check suffix
text.count("l")         # Count occurrences
```

### String Validation

```python
"abc123".isalnum()  # Contains only letters/numbers
"ABC".isupper()     # All uppercase
"Title".istitle()   # Title case (first letter capitalized)
"123".isdigit()     # Only digits
```

## List Operations

Lists are Python's most versatile sequence type. Understanding list operations is crucial for array manipulation.

### Essential List Methods

```python
nums = [1, 2, 3]
nums.append(4)      # Add single element to end
nums.extend([5,6])  # Add multiple elements to end
nums.insert(1, 5)   # Insert at specific index
nums.pop()          # Remove and return last element
nums.pop(1)         # Remove and return element at index
nums.remove(3)      # Remove first occurrence of value
```

### List Information

```python
len(nums)           # Get length
nums.index(2)       # Find index of value
nums.count(1)       # Count occurrences
2 in nums           # Check existence (True/False)
```

### List Ordering

```python
nums.sort()         # Sort in place
nums.reverse()      # Reverse in place
sorted(nums)        # Return new sorted list
reversed(nums)      # Return iterator of reversed list
```

## Dictionary Operations

Dictionaries are essential for key-value mappings and frequency counting.

### Core Dictionary Methods

```python
d = {'a': 1, 'b': 2}
d.get('a', 0)         # Get value with default
d.setdefault('c', 3)  # Set value only if key missing
d.update({'d': 4})    # Merge or add multiple items
```

### Dictionary Views

```python
d.keys()              # View of keys
d.values()            # View of values
d.items()             # View of (key, value) pairs
d.pop('a')            # Remove and return value
```

## Set Operations

Sets are powerful for removing duplicates and mathematical set operations.

### Essential Set Operations

```python
set1 = {1, 2, 3}
set2 = {3, 4, 5}
set1 & set2           # Intersection
set1 | set2           # Union
set1 - set2           # Difference
set1 ^ set2           # Symmetric difference
```

### Set Modifications

```python
set1.add(4)           # Add single element
set1.update([5,6])    # Add multiple elements
set1.remove(1)        # Remove (raises error if missing)
set1.discard(1)       # Remove (no error if missing)
```

## Collections Module

The collections module provides specialized container datatypes.

### Most Used Collections

```python
from collections import Counter, defaultdict, deque

# Counter for counting elements
Counter(['a','a','b'])    # {'a': 2, 'b': 1}

# defaultdict for automatic defaults
d = defaultdict(list)     # Default value is empty list
d['new'].append(1)        # No KeyError if key missing

# deque for efficient queue operations
q = deque([1,2,3])
q.appendleft(0)          # Add to left end
q.rotate(1)             # Rotate elements right
```

## Key Features to Remember

1. String methods always return new strings (strings are immutable)
2. List methods typically modify in place (except sorted())
3. Dictionary and set operations are generally O(1)
4. deque operations are O(1) at both ends
5. Counter is perfect for frequency counting
6. defaultdict eliminates key existence checking

This guide covers the most frequently used methods in technical interviews and everyday programming. Understanding these operations well can significantly improve code efficiency and readability.
