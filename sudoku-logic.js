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

// let startTime
let counter

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
  if ( puzzleArray[ emptyCell.rowIndex ].indexOf(num) == -1 ) return true // -1 is return value of .find() if value not found
  return false
}
const colSafe = (puzzleArray, emptyCell, num) => {
  if ( puzzleArray.some(row => row[ emptyCell.colIndex ] == num ) ) return false
  return true
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
  if (rowSafe(puzzleArray, emptyCell, num) && 
  colSafe(puzzleArray, emptyCell, num) && 
  boxSafe(puzzleArray, emptyCell, num) ) {
    return true
  }
  return false
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Obtain Next Empty Cell -------------------------------------
--------------------------------------------------------------------------------------------*/

const nextEmptyCell = puzzleArray => {
  const emptyCell = {rowIndex: "", colIndex: ""}

  puzzleArray.forEach( (row, rowIndex) => {
      if (emptyCell.colIndex !== "" ) return // If this key has already been assigned, skip iteration
      firstZero = row.find( col => col === 0) // find first zero-element
      if (firstZero === undefined) return; // if no zero present, skip to next row
      emptyCell.rowIndex = rowIndex
      emptyCell.colIndex = row.indexOf(firstZero)
    })
  if (emptyCell.colIndex !== "" ) {
    return emptyCell
  } else {
    return false // If emptyCell was never assigned, there are no more zeros
  }
}

/*--------------------------------------------------------------------------------------------
--------------------------------- Generate Filled Board -------------------------------------
--------------------------------------------------------------------------------------------*/

const fillPuzzle = startingBoard => {

  const emptyCell = nextEmptyCell(startingBoard)
  if (!emptyCell) { // If there are no more zeros, the board is finished, return it
    return startingBoard
  }
  // Shuffled [0 - 9 ] array fills board randomly each pass
  for (num of shuffle(numArray) ) {   
    counter++
    if ( counter > 20_000_000 ) throw new Error ("Recursion Timeout")
    if ( safeToPlace( startingBoard, emptyCell, num) ) {
      startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num // If safe to place number, place it
      if ( fillPuzzle(startingBoard) ) { // Recursively call the fill function to place num in next empty cell
        return startingBoard
      }
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

  while (removedVals.length < holes) {
    val = Math.floor(Math.random() * 81) // Value between 0-81
    randomRowIndex = Math.floor(val / 9) // Integer 0-8 for row index
    randomColIndex = val % 9 

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
    if ( !fillPuzzle( proposedBoard ) ) {  
      startingBoard[ randomRowIndex ][ randomColIndex ] = removedVals.pop().val 
    }
  }
  return [removedVals, startingBoard]
}

function newStartingBoard  (holes) {
  try {
    // startTime = new Date // Timer to see render times
    counter = 0
    let solvedBoard = newSolvedBoard()  // Generate a new populated board
  
    // Clone the populated board and poke holes in it. Stored the removed values for clues
    let [removedVals, startingBoard] = pokeHoles( solvedBoard.map ( row => row.slice() ), holes)
  
    // console.log(`RunTime: ${new Date - startTime}`) //Timer to see render time
    // console.log(counter)
    return [removedVals, startingBoard, solvedBoard]
  } catch (error) {
      // console.log(`Stopped after: ${(new Date - startTime)} milliseconds`)
    return newStartingBoard(holes)
  }
}

// function HundredGames() {
//   for (let index = 0; index < 50; index++) {
//     newStartingBoard(60)
    // console.log('Next Game')
//   }
  // console.log('All Done')
// }