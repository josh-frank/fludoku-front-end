const BLANK_BOARD = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

//For Testing Multiple Possible Solutions
const MULTIPLE_SOLUTION = [
  [0,1,7,5,6,0,0,0,8],
  [0,5,0,0,0,1,3,0,7],
  [0,9,2,0,0,0,6,0,1],
  [0,7,0,2,3,0,8,4,0],
  [4,3,0,6,1,0,0,7,9],
  [0,6,8,0,0,7,0,3,0],
  [7,0,0,1,5,0,9,8,4],
  [0,0,1,7,0,3,5,0,0],
  [0,0,6,0,2,0,7,0,0]
]

// let startTime 
let counter
let pokeCounter
let errorCount

const numArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function shuffle( array ) {
  let newArray = [...array]
  for ( let i = newArray.length - 1; i > 0; i-- ) {
      const j = Math.floor( Math.random() * ( i + 1 ) );
      [ newArray[ i ], newArray[ j ] ] = [ newArray[ j ], newArray[ i ] ];
  }
  return newArray;
}


/*--------------------------------------------------------------------------------------------
--------------------------------- Check if Location Safe -------------------------------------
--------------------------------------------------------------------------------------------*/

const rowSafe = (puzzleArray, emptyCell, num) => {
  // -1 is return value of .find() if value not found
  return puzzleArray[ emptyCell.rowIndex ].indexOf(num) == -1 
}
const colSafe = (puzzleArray, emptyCell, num) => {
  return !puzzleArray.some(row => row[ emptyCell.colIndex ] == num )
}

const boxSafe = (puzzleArray, emptyCell, num) => {
  boxStartRow = emptyCell.rowIndex - (emptyCell.rowIndex % 3) // Define top left corner of box region for empty cell
  boxStartCol = emptyCell.colIndex - (emptyCell.colIndex % 3)
  let safe = true

  for ( boxRow of [0,1,2] ) {  // Each box region has 3 rows
    for ( boxCol of [0,1,2] ) { // Each box region has 3 columns
      if ( puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] == num ) { // Num is present in box region?
        safe = false // If number is found, it is not safe to place
      }
    }
  }
  return safe
}

const safeToPlace = ( puzzleArray, emptyCell, num ) => {
  return rowSafe(puzzleArray, emptyCell, num) && 
  colSafe(puzzleArray, emptyCell, num) && 
  boxSafe(puzzleArray, emptyCell, num) 
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Obtain Next Empty Cell -------------------------------------
--------------------------------------------------------------------------------------------*/

const nextEmptyCell = puzzleArray => {
  const emptyCell = {rowIndex: "", colIndex: ""}

  puzzleArray.forEach( (row, rowIndex) => {
    if (emptyCell.colIndex !== "" ) return // If this key has already been assigned, skip iteration
    let firstZero = row.find( col => col === 0) // find first zero-element
    if (firstZero === undefined) return; // if no zero present, skip to next row
    emptyCell.rowIndex = rowIndex
    emptyCell.colIndex = row.indexOf(firstZero)
  })

  if (emptyCell.colIndex !== "" ) return emptyCell
  // If emptyCell was never assigned, there are no more zeros
  return false
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Generate Filled Board -------------------------------------
--------------------------------------------------------------------------------------------*/

const fillPuzzle = startingBoard => {

  const emptyCell = nextEmptyCell(startingBoard)
   // If there are no more zeros, the board is finished, return it
  if (!emptyCell) return startingBoard

  // Shuffled [0 - 9 ] array fills board randomly each pass
  for (num of shuffle(numArray) ) {   
    counter++
    if ( counter > 20_000_000 ) throw new Error ("Recursion Timeout")
    if ( safeToPlace( startingBoard, emptyCell, num) ) {
      // If safe to place number, place it
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num 
      // Recursively call the fill function to place num in next empty cell
      if ( fillPuzzle(startingBoard) ) return startingBoard 
      // If we were unable to place the future num, that num was wrong. Reset it and try next value
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0 
    }
  }
  return false // If unable to place any number, return false, which triggers previous round to go to next num

}

const newSolvedBoard = _ => {
  const newBoard = BLANK_BOARD.map(row => row.slice() ) // Create an unaffiliated clone of a fresh board
  fillPuzzle(newBoard) // Populate the board using backtracking algorithm
  return newBoard
}

const pokeHoles = (startingBoard, holes) => {
  const removedVals = []
  const val = shuffle( range(0,80) )

  while (removedVals.length < holes) {
    const nextVal = val.pop()
    if (nextVal === undefined) throw new Error ("Impossible Game")
    const randomRowIndex = Math.floor(nextVal / 9) // Integer 0-8 for row index
    const randomColIndex = nextVal % 9 

    if (!startingBoard[ randomRowIndex ]) continue // guard against cloning error
    if ( startingBoard[ randomRowIndex ][ randomColIndex ] == 0 ) continue // If cell already empty, restart loop
    
    removedVals.push({  // Store the current value at the coordinates
      rowIndex: randomRowIndex, 
      colIndex: randomColIndex, 
      val: startingBoard[ randomRowIndex ][ randomColIndex ] 
    })
    startingBoard[ randomRowIndex ][ randomColIndex ] = 0 // "poke a hole" in the board at the coords
    const proposedBoard = startingBoard.map ( row => row.slice() ) // Clone this changed board
    
    // Attempt to solve the board after removing value. If it cannot be solved, restore the old value.
    // and remove that option from the list

    if ( multiplePossibleSolutions( startingBoard.map ( row => row.slice() ) ) ) {  
      startingBoard[ randomRowIndex ][ randomColIndex ] = removedVals.pop().val 
    }

  }
  return [removedVals, startingBoard]
}

function newStartingBoard  (holes) {
  try {
    // startTime = new Date // Timer to see render times
    counter = 0
    pokeCounter = 0
    let solvedBoard = newSolvedBoard()  // Generate a new populated board
  
    // Clone the populated board and poke holes in it. Stored the removed values for clues
    let [removedVals, startingBoard] = pokeHoles( solvedBoard.map ( row => row.slice() ), holes)
  
    // console.log(`RunTime: ${new Date - startTime}`) //Timer to see render time
    // console.log(counter)
    return [removedVals, startingBoard, solvedBoard]
  } catch (error) {
      // console.log(`Stopped after: ${(new Date - startTime)} milliseconds`)
      // console.log(error)
      errorCount ++
      if (errorCount === 4) throw new Error('Too many errors')
    return newStartingBoard(holes)
  }
}

function newGame(holes) {
  errorCount = 0
  // renderLoading()
  try {
    return newStartingBoard(holes)
  
  } catch (error) {
    closeLoading()
    renderRetryPrompt()
    document.getElementById('abort-button').addEventListener('click', ()=>{
      document.getElementById('new-game-form').reset()
      closeRetryPrompt()
      })
  }
}

// The board will be completely solved once for each item in the empty cell list.
// The empty cell array is rotated on each iteration, so that the order of the empty cells
// And thus the order of solving the game, is different each time.
// The solution for each attempt is pushed to a possibleSolutions array as a string
// Multiple solutions are identified by taking a unique Set from the possible solutions
// and measuring its length. If multiple possible solutions are found at any point
// If will return true, prompting the pokeHoles function to select a new value for removal.

function multiplePossibleSolutions (boardToCheck) {
  const possibleSolutions = []
  const emptyCellArray = emptyCellCoords(boardToCheck)
  for (let index = 0; index < emptyCellArray.length; index++) {
    // Rotate a clone of the emptyCellArray by one for each iteration
    emptyCellClone = [...emptyCellArray]
    const startingPoint = emptyCellClone.splice(index, 1);
    emptyCellClone.unshift( startingPoint[0] ) 
    thisSolution = fillFromArray( boardToCheck.map( row => row.slice() ) , emptyCellClone)
    possibleSolutions.push( thisSolution.join() )
    if (Array.from(new Set(possibleSolutions)).length > 1 ) return true
  }
  return false
}

  // function eachSlice(string, length) {
  //   const newArray = []
  
  //   for (let index = 0; index < length; index++) {
  //     const startIndex = index*length
  //     const endIndex = startIndex + length
  //     const fragment = string.split(',').slice( startIndex, endIndex )
  //     newArray.push( fragment.map( cell => parseInt(cell) ) )
  //   }
  //   return newArray
  // } 


// This will attempt to solve the puzzle by placing values into the board in the order that
// the empty cells list presents
function fillFromArray(startingBoard, emptyCellArray) {
  const emptyCell = nextStillEmptyCell(startingBoard, emptyCellArray)
  if (!emptyCell) return startingBoard
  for (num of shuffle(numArray) ) {   
    pokeCounter++
    if ( pokeCounter > 60_000_000 ) throw new Error ("Poke Timeout")
    if ( safeToPlace( startingBoard, emptyCell, num) ) {
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num 
      if ( fillFromArray(startingBoard, emptyCellArray) ) return startingBoard 
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0 
    }
  }
  return false
}

// As numbers get placed, not all of the initial cells are still empty.
// This will find the next still empty cell in the list
function nextStillEmptyCell (startingBoard, emptyCellArray) {
  for (coords of emptyCellArray) {
    if (startingBoard[ coords.row ][ coords.col ] === 0) return {rowIndex: coords.row, colIndex: coords.col}
  }
  return false
}

// Generate array from range, inclusive of start & endbounds.
const range = (start, end) => {
  const length = end - start + 1
  return Array.from( {length} , ( _ , i) => start + i)
}

// Get a list of all empty cells in the board from top-left to bottom-right
function emptyCellCoords (startingBoard) {
  const listOfEmptyCells = []
  for (const row of range(0,8)) {
    for (const col of range(0,8) ) {
      if (startingBoard[row][col] === 0 ) listOfEmptyCells.push( {row, col } )
    }
  }
  return listOfEmptyCells
}



// let [myRemovedVals, myStartingBoard, mySolvedBoard] = newStartingBoard(64)
// multiplePossibleSolutions (myStartingBoard)