import { createInterface } from 'readline';
import { table } from 'table';
import { performance } from 'perf_hooks'; 

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";

const startupScreen = `
 _______ _     _ ______   _____  _     _ _     _   ______   ______ _     _ _______ _______ _______  _____   ______ _______ _______
 |______ |     | |     \\ |     | |____/  |     |   |_____] |_____/ |     |    |    |______ |______ |     | |_____/ |       |______
 ______| |_____| |_____/ |_____| |    \\_ |_____| . |_____] |    \\_ |_____|    |    |______ |       |_____| |    \\_ |_____  |______
`;

function centerText(text, width) {
    const lines = text.split('\n');
    return lines.map(line => {
        const padding = Math.max(0, Math.floor((width - line.length) / 2));
        return ' '.repeat(padding) + line;
    }).join('\n');
}

const terminalWidth = process.stdout.columns;

console.clear();
console.log(centerText(startupScreen, terminalWidth));
console.log(centerText(`almightynan - https://almightynan.cc`, terminalWidth))
console.log(`\n`)

let attempts = 0; 
let totalCandidates = 0;
let displayFrequency = 100; 

function displayGrid(grid, isGuessed) {
    console.clear();
    const data = [[' '].concat(Array.from({ length: grid.length }, (_, i) => (i + 1).toString()))];

    grid.forEach((row, rowIndex) => {
        const coloredRow = row.map((num, colIndex) => {
            if (isGuessed[rowIndex][colIndex]) {
                return `${GREEN}${num}${RESET}`;
            } else {
                return num;
            }
        });
        data.push([`Row ${rowIndex + 1}`].concat(coloredRow));
    });

    const output = table(data);
    console.log(output); 
}

function isValid(grid, row, col, num, gridSize) {
    const n = Math.sqrt(gridSize);

    for (let x = 0; x < gridSize; x++) {
        if (grid[row][x] === num) return false;
    }

    for (let x = 0; x < gridSize; x++) {
        if (grid[x][col] === num) return false;
    }

    const startRow = row - (row % n);
    const startCol = col - (col % n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}

function getCandidates(grid, row, col, gridSize) {
    const candidates = [];
    for (let num = 1; num <= gridSize; num++) {
        attempts++;
        if (isValid(grid, row, col, num, gridSize)) {
            candidates.push(num);
        }
    }
    totalCandidates += candidates.length; 
    return candidates;
}

function findNextCell(grid, gridSize) {
    let minOptions = gridSize + 1;
    let bestCell = null;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 0) {
                const candidates = getCandidates(grid, row, col, gridSize);
                if (candidates.length < minOptions) {
                    minOptions = candidates.length;
                    bestCell = { row, col, candidates };
                    if (minOptions === 1) return bestCell;
                }
            }
        }
    }
    return bestCell;
}

async function solveSudoku(grid, gridSize, isGuessed, placementCounter = 0) {
    const cell = findNextCell(grid, gridSize);
    if (!cell) return true; 

    const { row, col, candidates } = cell;
    for (const num of candidates) {
        grid[row][col] = num;
        isGuessed[row][col] = true; 
        placementCounter++;

        if (placementCounter % displayFrequency === 0) {
            displayGrid(grid, isGuessed);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (await solveSudoku(grid, gridSize, isGuessed, placementCounter)) return true;
        grid[row][col] = 0;
        isGuessed[row][col] = false;
    }
    return false;
}

async function promptGridSize() {
    return new Promise((resolve) => {
        rl.question("> Enter the size of the grid (e.g., 9 for a 9x9 grid): ", (input) => {
            const gridSize = parseInt(input, 10);
            if (!isNaN(gridSize) && Number.isInteger(Math.sqrt(gridSize))) {
                resolve(gridSize);
            } else {
                console.error("[!] Invalid input. Please enter a perfect square number (e.g., 4, 9, 16).");
                resolve(promptGridSize());
            }
        });
    });
}

async function promptForRowInput(rowIndex, gridSize) {
    return new Promise((resolve) => {
        rl.question(`> Enter numbers for row ${rowIndex + 1} (use 0 for empty cells): `, (input) => {
            const rowValues = input.split('').map(Number);
            if (rowValues.length === gridSize && rowValues.every(val => Number.isInteger(val) && val >= 0 && val <= gridSize)) {
                resolve(rowValues);
            } else {
                console.error(`[!] Invalid input. Please enter exactly ${gridSize} numbers, using 0 for empty cells.`);
                resolve(promptForRowInput(rowIndex, gridSize));
            }
        });
    });
}

async function promptForSudokuInput(gridSize) {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
        const row = await promptForRowInput(i, gridSize);
        grid.push(row);
    }
    return grid;
}

function generateRandomGrid(gridSize) {
    const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    const numToPlace = Math.floor(gridSize * 1.5);

    for (let i = 0; i < numToPlace; i++) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const num = Math.floor(Math.random() * gridSize) + 1;

        if (isValid(grid, row, col, num, gridSize)) {
            grid[row][col] = num;
        }
    }
    return grid;
}

async function promptUserChoice() {
    return new Promise((resolve) => {
        rl.question("> Would you like to enter your own grid (type '1') or generate a random grid (type '2')? ", (input) => {
            if (input === '1' || input === '2') {
                resolve(input);
            } else {
                console.error("[!] Invalid choice. Please type '1' to enter your own grid or '2' to generate a random grid.");
                resolve(promptUserChoice());
            }
        });
    });
}

(async () => {
    const gridSize = await promptGridSize();
    const userChoice = await promptUserChoice();

    let userGrid;
    if (userChoice === '1') {
        userGrid = await promptForSudokuInput(gridSize);
    } else {
        userGrid = generateRandomGrid(gridSize);
        console.log("Generated random Sudoku grid:");
        displayGrid(userGrid, Array.from({ length: gridSize }, () => Array(gridSize).fill(false)));
    }

    console.log("Initial Sudoku grid:");
    const isGuessed = Array.from({ length: gridSize }, () => Array(gridSize).fill(false));
    displayGrid(userGrid, isGuessed);

    const startTime = performance.now();
    await solveSudoku(userGrid, gridSize, isGuessed);
    const endTime = performance.now(); 

    console.log("Solved Sudoku grid:");
    displayGrid(userGrid, isGuessed);

    const timeTaken = ((endTime - startTime) / 1000).toFixed(5);
    console.info(`[ i ] Performance Metrics:`);
    console.log(`- Total attempts made: ${attempts}`);
    console.log(`- Total candidates checked: ${totalCandidates}`);
    console.log(`- Time taken to solve: ${timeTaken} seconds`);
    console.log("- Time Complexity: O(n!) in the worst case");
    console.log("- Space Complexity: O(n^2)");
    rl.close();
    rl.close();
})();
