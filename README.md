# Sudoku Solver

## Overview

This Sudoku Solver is a command-line tool that lets you solve Sudoku puzzles of any size. Users can create their own grids or generate random grids. The program uses a brute-force method combined with optimization approaches to investigate potential solutions while providing real-time visual feedback on the solving process.

## Features

- **Custom Input**: Users can create their own Sudoku grid by typing 0 to represent empty cells.
- **Random Grid Generation**: The application can create a random Sudoku grid of a specific size.
- **Real-Time Visualization**: Displays the Sudoku grid and highlights guessed numbers in real time as you solve the puzzle.
- **Performance Metrics**: After solving, it shows the total number of attempts, candidates checked, and time taken to complete the puzzle.

## Prerequisites

- Node.js (version 12 or higher)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/almightynan/sudoku-bruteforce.git
   cd sudoku-solver
   ```

2. Install the required packages:
   ```bash
   npm install
   ```

## Usage

1. Run the application:
   ```bash
   node index.js
   ```

2. Follow the prompts to either input your own Sudoku grid or generate a random one:
   - Enter the size of the grid (e.g., 9 for a 9x9 grid).
   - Input the numbers for each row, using `0` for empty cells.

## Example

Here's an example of how to input a Sudoku grid:

```
> Enter the size of the grid (e.g., 9 for a 9x9 grid): 9
> Enter numbers for row 1 (use 0 for empty cells): 5 3 0 0 7 0 0 0 0
> Enter numbers for row 2 (use 0 for empty cells): 6 0 0 1 9 5 0 0 0
> Enter numbers for row 3 (use 0 for empty cells): 0 9 8 0 0 0 0 6 0
...
```

## Performance Metrics

Once the Sudoku is solved, the application will output:

- Total attempts made
- Total candidates checked
- Time taken to solve the puzzle
- Time complexity: O(n!) in the worst case
- Space complexity: O(n²)

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by various algorithms for solving Sudoku puzzles.
- Uses the [table](https://www.npmjs.com/package/table) package for formatted grid output.


