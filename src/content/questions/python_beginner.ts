import { Question } from '../../types';

export const EXPLICIT_PYTHON_BEGINNER: Question[] = [
  {
    id: 'PY-BEG-001',
    title: 'Filter Even Numbers',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    difficulty: 'Beginner',
    category: 'Core Python: Comprehensions',
    track: 'python',
    company: 'Stripe',
    xp: 50,
    prompt: 'Given a list `nums`, write a function `filter_even(nums)` that returns a new list containing only the even numbers, preserving order.',
    starter_code: `def filter_even(nums):
    # your code here
    pass`,
    solution_sql: `def filter_even(nums):\n    return [n for n in nums if n % 2 == 0]`,
    solution_code: `def filter_even(nums):\n    return [n for n in nums if n % 2 == 0]`,
    test_cases: [
      { input: '[1,2,3,4,5,6]', expected: '[2,4,6]' },
      { input: '[1,3,5]', expected: '[]' },
      { input: '[]', expected: '[]' }
    ],
    expected_output: [2, 4, 6],
    hints: [
      { tier: 1, title: 'Modulo Operator', body: 'Use the modulo operator % to test evenness (n % 2 == 0).' },
      { tier: 2, title: 'Idiomatic Style', body: 'A list comprehension is more idiomatic here than an explicit for-loop with .append().' },
      { tier: 3, title: 'Complete Solution', body: `def filter_even(nums):\n    return [n for n in nums if n % 2 == 0]` }
    ],
    interview_edge_case: 'Ask about negative numbers: -4 % 2 == 0 in Python (unlike some languages where the sign of the result follows the dividend), so negative evens are still correctly included.'
  },
  {
    id: 'PY-BEG-002',
    title: 'Word Frequency Counter',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    difficulty: 'Beginner',
    category: 'Core Python: Dictionaries',
    track: 'python',
    company: 'Databricks',
    xp: 50,
    prompt: "Write `word_count(text)` that returns a dict mapping each lowercase word to its frequency, splitting on whitespace and ignoring punctuation (.,!?).",
    starter_code: `def word_count(text):
    # your code here
    pass`,
    solution_sql: `import re

def word_count(text):
    words = re.findall(r"[a-zA-Z']+", text.lower())
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts`,
    solution_code: `import re

def word_count(text):
    words = re.findall(r"[a-zA-Z']+", text.lower())
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts`,
    test_cases: [
      { input: "'The cat sat. The cat ran!'", expected: "{'the':2,'cat':2,'sat':1,'ran':1}" },
      { input: "''", expected: '{}' }
    ],
    expected_output: { the: 2, cat: 2, sat: 1, ran: 1 },
    hints: [
      { tier: 1, title: 'Safe Retrieval', body: 'dict.get(key, 0) avoids a KeyError when a word is seen for the first time.' },
      { tier: 2, title: 'Case Normalization', body: "Lowercase the text before counting so 'The' and 'the' aren't treated as different words." },
      { tier: 3, title: 'Complete Solution', body: `import re\n\ndef word_count(text):\n    words = re.findall(r"[a-zA-Z']+", text.lower())\n    counts = {}\n    for w in words:\n        counts[w] = counts.get(w, 0) + 1\n    return counts` }
    ],
    interview_edge_case: "Ask how this scales to a 10GB text file — the interviewer wants to hear 'stream line by line, don't load the whole file into memory' as a bridge into the Data Engineering mindset."
  },
  {
    id: 'PY-BEG-003',
    title: 'Filter a DataFrame with pandas',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    difficulty: 'Beginner',
    category: 'pandas Basics',
    track: 'python',
    company: 'Uber',
    xp: 50,
    prompt: 'Given a pandas DataFrame `df` with columns `name` and `age`, write `adults(df)` that returns a DataFrame containing only rows where age >= 18, with the original index preserved.',
    starter_code: `import pandas as pd

def adults(df):
    # your code here
    pass`,
    solution_sql: `import pandas as pd

def adults(df):
    return df[df['age'] >= 18]`,
    solution_code: `import pandas as pd

def adults(df):
    return df[df['age'] >= 18]`,
    test_cases: [
      { input: "pd.DataFrame({'name':['A','B','C'],'age':[15,20,18]})", expected: 'rows for B and C, index preserved as [1,2]' }
    ],
    expected_output: 'Filtered DataFrame with 2 rows',
    hints: [
      { tier: 1, title: 'Boolean Masking', body: 'Boolean masking (df[condition]) is the idiomatic pandas filter pattern.' },
      { tier: 2, title: 'Performance Anti-Pattern', body: 'Avoid .iterrows() for filtering — it is extremely slow and non-idiomatic.' },
      { tier: 3, title: 'Complete Solution', body: `import pandas as pd\n\ndef adults(df):\n    return df[df['age'] >= 18]` }
    ],
    interview_edge_case: "Ask why df[df['age'] >= 18] is preferred over a Python for-loop over rows: vectorized operations run in compiled C under the hood and are 10-100x faster on large DataFrames."
  },
  {
    id: 'PY-BEG-004',
    title: 'Groupby Average',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    difficulty: 'Beginner',
    category: 'pandas Basics',
    track: 'python',
    company: 'Netflix',
    xp: 60,
    prompt: 'Given a DataFrame `df` with columns `department` and `salary`, write `avg_salary_by_dept(df)` returning a Series indexed by department with the mean salary per department.',
    starter_code: `import pandas as pd

def avg_salary_by_dept(df):
    # your code here
    pass`,
    solution_sql: `import pandas as pd

def avg_salary_by_dept(df):
    return df.groupby('department')['salary'].mean()`,
    solution_code: `import pandas as pd

def avg_salary_by_dept(df):
    return df.groupby('department')['salary'].mean()`,
    test_cases: [
      { input: 'df with Engineering:[95000,82000], Sales:[71000,68000]', expected: 'Engineering 88500.0, Sales 69500.0' }
    ],
    expected_output: 'pandas Series indexed by department',
    hints: [
      { tier: 1, title: 'Three-Step Pattern', body: 'groupby() + column selector + aggregation method is the standard three-step pattern.' },
      { tier: 2, title: 'Series vs DataFrame', body: 'The result is a Series, not a DataFrame, unless you call .reset_index().' },
      { tier: 3, title: 'Complete Solution', body: `import pandas as pd\n\ndef avg_salary_by_dept(df):\n    return df.groupby('department')['salary'].mean()` }
    ],
    interview_edge_case: "Ask how to get multiple aggregations at once (e.g. mean AND count) — the answer is .agg(['mean','count']) or .agg({'salary':['mean','count']})."
  },
  {
    id: 'PY-BEG-005',
    title: 'Vectorize a Discount Calculation',
    source_book: 'Python for Data Analysis (Wes McKinney)',
    difficulty: 'Beginner',
    category: 'Vectorized Operations',
    track: 'python',
    company: 'Amazon',
    xp: 60,
    prompt: 'Given a pandas Series `prices`, write `apply_discount(prices, pct)` that returns a new Series with each price reduced by `pct` percent, WITHOUT using .apply() or a Python loop — use a vectorized arithmetic expression.',
    starter_code: `import pandas as pd

def apply_discount(prices, pct):
    # your code here (no .apply(), no for-loop)
    pass`,
    solution_sql: `import pandas as pd

def apply_discount(prices, pct):
    return prices * (1 - pct / 100)`,
    solution_code: `import pandas as pd

def apply_discount(prices, pct):
    return prices * (1 - pct / 100)`,
    test_cases: [
      { input: 'prices=[100,200], pct=10', expected: '[90.0, 180.0]' },
      { input: 'prices=[50], pct=0', expected: '[50.0]' }
    ],
    expected_output: '[90.0, 180.0]',
    hints: [
      { tier: 1, title: 'Vectorized Arithmetic', body: 'pandas Series support element-wise arithmetic directly, no loop needed.' },
      { tier: 2, title: 'Discount Multiplier', body: '1 - pct/100 gives you the multiplier to keep after the discount.' },
      { tier: 3, title: 'Complete Solution', body: `import pandas as pd\n\ndef apply_discount(prices, pct):\n    return prices * (1 - pct / 100)` }
    ],
    interview_edge_case: "Ask candidates to benchmark prices.apply(lambda x: x*0.9) vs prices*0.9 on a 1M-row Series — the vectorized version is dramatically faster because .apply() falls back to a Python-level loop internally."
  }
];
