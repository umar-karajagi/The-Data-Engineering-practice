import { Question } from '../../types';

export const EXPLICIT_DSA_BEGINNER: Question[] = [
  {
    id: 'DSA-BEG-001',
    title: 'Two Sum',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Beginner',
    category: 'Arrays & HashMaps',
    track: 'dsa',
    company: 'Stripe',
    xp: 60,
    prompt: 'Given an array of integers `nums` and a target value, return the indices of the two numbers that add up to target. Assume exactly one solution exists.',
    starter_code: `def two_sum(nums, target):
    # your code here
    pass`,
    solution_code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []`,
    solution_sql: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []`,
    test_cases: [
      { input: 'nums=[2,7,11,15], target=9', expected: '[0,1]' },
      { input: 'nums=[3,2,4], target=6', expected: '[1,2]' }
    ],
    expected_output: '[0,1]',
    hints: [
      { tier: 1, title: 'Trade Space for Time', body: 'A brute-force nested loop is O(n^2) — think about trading space for time.' },
      { tier: 2, title: 'HashMap Complement Seek', body: 'A hashmap of value -> index lets you check for the complement in O(1) average time per element.' },
      { tier: 3, title: 'Complete Solution', body: `def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []` }
    ],
    interview_edge_case: 'Ask candidates to state time/space complexity of both the brute-force and hashmap approaches — O(n^2)/O(1) vs O(n)/O(n) — since interviewers grade on this tradeoff articulation as much as the code.',
    optimization_guide: {
      timeComplexity: 'O(N) single-pass hash lookup',
      spaceComplexity: 'O(N) seen hashmap buffer',
      explainPlanNotes: 'Equivalent to an in-memory hash join where keys are mapped to indices in a single streaming pass.',
      productionPitfall: 'Using list.index() inside the loop silently degrades complexity back to O(N^2).'
    }
  },
  {
    id: 'DSA-BEG-002',
    title: 'Valid Parentheses',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Beginner',
    category: 'Stacks',
    track: 'dsa',
    company: 'Uber',
    xp: 60,
    prompt: "Given a string containing only '(', ')', '{', '}', '[' and ']', determine if the brackets are validly matched and nested.",
    starter_code: `def is_valid(s):
    # your code here
    pass`,
    solution_code: `def is_valid(s):
    pairs = {')':'(', ']':'[', '}':'{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
    solution_sql: `def is_valid(s):
    pairs = {')':'(', ']':'[', '}':'{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
    test_cases: [
      { input: "'()[]{}'", expected: 'True' },
      { input: "'(]'", expected: 'False' },
      { input: "'([)]'", expected: 'False' },
      { input: "'{[]}'", expected: 'True' }
    ],
    expected_output: 'True',
    hints: [
      { tier: 1, title: 'LIFO Stack Property', body: "A stack naturally models 'most recently opened bracket must close first.'" },
      { tier: 2, title: 'Empty Stack Check', body: "Don't forget to check that the stack is empty at the end — 's = \"((\"' would otherwise be missed." },
      { tier: 3, title: 'Complete Solution', body: `def is_valid(s):\n    pairs = {')':'(', ']':'[', '}':'{'}\n    stack = []\n    for ch in s:\n        if ch in '([{':\n            stack.append(ch)\n        elif ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n    return not stack` }
    ],
    interview_edge_case: 'Ask why this pattern (stack-based matching) generalizes to validating nested JSON/XML structures — a common real-world DE task when validating semi-structured source files before ingestion.',
    optimization_guide: {
      timeComplexity: 'O(N) single scan of the character stream',
      spaceComplexity: 'O(N) worst case stack for all opening brackets',
      explainPlanNotes: 'Directly powers pushdown automata and Lexer parsing engines.',
      productionPitfall: 'Forgetting to check the remaining stack length after the loop leaves unclosed opening brackets unflagged.'
    }
  },
  {
    id: 'DSA-BEG-003',
    title: 'Merge Two Sorted Arrays',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Beginner',
    category: 'Two Pointers',
    track: 'dsa',
    company: 'Netflix',
    xp: 60,
    prompt: 'Given two sorted arrays `a` and `b`, merge them into a single sorted array without using a built-in sort.',
    starter_code: `def merge_sorted(a, b):
    # your code here
    pass`,
    solution_code: `def merge_sorted(a, b):
    i, j, merged = 0, 0, []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            merged.append(a[i]); i += 1
        else:
            merged.append(b[j]); j += 1
    merged.extend(a[i:])
    merged.extend(b[j:])
    return merged`,
    solution_sql: `def merge_sorted(a, b):
    i, j, merged = 0, 0, []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            merged.append(a[i]); i += 1
        else:
            merged.append(b[j]); j += 1
    merged.extend(a[i:])
    merged.extend(b[j:])
    return merged`,
    test_cases: [
      { input: 'a=[1,3,5], b=[2,4,6]', expected: '[1,2,3,4,5,6]' },
      { input: 'a=[], b=[1,2]', expected: '[1,2]' }
    ],
    expected_output: '[1,2,3,4,5,6]',
    hints: [
      { tier: 1, title: 'Two Pointers Traversal', body: 'Use two pointers, one per array, advancing whichever points to the smaller current value.' },
      { tier: 2, title: 'Residual Tail Drain', body: 'Do not forget to append any leftover elements once one array is exhausted.' },
      { tier: 3, title: 'Complete Solution', body: `def merge_sorted(a, b):\n    i, j, merged = 0, 0, []\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            merged.append(a[i]); i += 1\n        else:\n            merged.append(b[j]); j += 1\n    merged.extend(a[i:])\n    merged.extend(b[j:])\n    return merged` }
    ],
    interview_edge_case: 'Ask how this exact two-pointer merge maps directly onto the merge step of external merge sort — the technique Spark and most databases use to combine sorted partitions larger than memory, tying DSA directly back to the Spark/Kleppmann tracks.',
    optimization_guide: {
      timeComplexity: 'O(N + M) linear scan across both input streams',
      spaceComplexity: 'O(N + M) merged result buffer',
      explainPlanNotes: 'Underlies SortMergeJoin in Apache Spark and PostgreSQL.',
      productionPitfall: 'Calling .sort() on concatenated lists triggers O((N+M) log(N+M)) overhead, throwing away the already-sorted precondition.'
    }
  },
  {
    id: 'DSA-BEG-004',
    title: 'Find the First Duplicate',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Beginner',
    category: 'HashSets',
    track: 'dsa',
    company: 'Snowflake',
    xp: 50,
    prompt: 'Given an array of integers, return the first value that appears more than once (by first-seen-as-duplicate order while scanning left to right). Return None if there are no duplicates.',
    starter_code: `def first_duplicate(nums):
    # your code here
    pass`,
    solution_code: `def first_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return n
        seen.add(n)
    return None`,
    solution_sql: `def first_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return n
        seen.add(n)
    return None`,
    test_cases: [
      { input: '[2,1,3,5,3,2]', expected: '3' },
      { input: '[1,2,3]', expected: 'None' }
    ],
    expected_output: '3',
    hints: [
      { tier: 1, title: 'O(1) Set Membership', body: 'A set gives O(1) average membership checks — far better than an O(n^2) nested-loop comparison.' },
      { tier: 2, title: 'Short-Circuit Early Exit', body: 'Return as soon as you find the first repeat; do not scan the whole array first and pick afterward.' },
      { tier: 3, title: 'Complete Solution', body: `def first_duplicate(nums):\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return n\n        seen.add(n)\n    return None` }
    ],
    interview_edge_case: "Ask how this generalizes to deduplicating records in a streaming pipeline where you can't hold the full history in memory — this bridges into approximate structures like Bloom filters, a common follow-up in Kafka/streaming interviews.",
    optimization_guide: {
      timeComplexity: 'O(K) where K <= N is the index of the first duplicate',
      spaceComplexity: 'O(K) tracking set',
      explainPlanNotes: 'Deduplication operator in streaming execution engines.',
      productionPitfall: 'Maintaining unbounded HashSet state in long-running streaming jobs causes eventual out-of-memory crashes.'
    }
  },
  {
    id: 'DSA-BEG-005',
    title: 'Maximum Sum of a Fixed-Size Window',
    source_book: 'DSA for Data Engineers — General CS Fundamentals',
    difficulty: 'Beginner',
    category: 'Sliding Window',
    track: 'dsa',
    company: 'Databricks',
    xp: 70,
    prompt: 'Given an array of integers `nums` and a window size `k`, return the maximum sum of any contiguous subarray of length k.',
    starter_code: `def max_window_sum(nums, k):
    # your code here
    pass`,
    solution_code: `def max_window_sum(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
    solution_sql: `def max_window_sum(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum`,
    test_cases: [
      { input: 'nums=[2,1,5,1,3,2], k=3', expected: '9' },
      { input: 'nums=[1,1,1,1], k=2', expected: '2' }
    ],
    expected_output: '9',
    hints: [
      { tier: 1, title: 'Sliding Window Optimization', body: 'Compute the first window sum once, then slide by subtracting the outgoing element and adding the incoming one.' },
      { tier: 2, title: 'Avoid Redundant Sums', body: 'This turns an O(n*k) brute force into O(n).' },
      { tier: 3, title: 'Complete Solution', body: `def max_window_sum(nums, k):\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum` }
    ],
    interview_edge_case: "Ask candidates to connect this directly to Spark Structured Streaming's tumbling/sliding window aggregations — the fixed-window-sum pattern here is the exact conceptual building block behind windowed streaming aggregations covered in the PySpark track.",
    optimization_guide: {
      timeComplexity: 'O(N) single pass over nums',
      spaceComplexity: 'O(1) auxiliary variables',
      explainPlanNotes: 'Streaming window state maintainer without re-reading past buffers.',
      productionPitfall: 'Recomputing sum(nums[i:i+k]) on each step costs O(N*K) CPU time.'
    }
  }
];
