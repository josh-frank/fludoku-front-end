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
  
    for ( boxRow of [0,1,2] ) {
      for ( boxCol of [0,1,2] ) {
        if ( puzzleArray[boxStartRow + boxRow][boxStartCol + boxCol] == num ) {
          safe = false
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
        if (emptyCell.colIndex !== "" ) return 
        firstZero = row.find( col => col === 0)
        if (firstZero === undefined) return;
        emptyCell.rowIndex = rowIndex
        emptyCell.colIndex = row.indexOf(firstZero)
      })
    if (emptyCell.colIndex !== "" ) {
      return emptyCell
    } else {
      return false
    }
  }
  
  /*--------------------------------------------------------------------------------------------
  --------------------------------- Generate Filled Board -------------------------------------
  --------------------------------------------------------------------------------------------*/
  
  const fillPuzzle = startingBoard => {
    const emptyCell = nextEmptyCell(startingBoard)
    if (!emptyCell) {
      return startingBoard
    }
  
    for (num of shuffle(numArray) ) {   // Shuffled num array allows you to use this for filling empty board or solve existing board
      if ( safeToPlace( startingBoard, emptyCell, num) ) {
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = num
        if ( fillPuzzle(startingBoard) ) {
          return startingBoard
        }
        startingBoard[ emptyCell.rowIndex ][ emptyCell.colIndex ] = 0
      }
    }
    return false // If unable to place any number, return false, which triggers previous roudn to go to next num
  }
  
  const newSolvedBoard = _ => {
    const newBoard = BLANK_BOARD.map(row => row.slice() )
    fillPuzzle(newBoard)
    return newBoard
  }
  
  const pokeHoles = (solvedBoard, holes) => {
    const startingBoard = solvedBoard.map ( row => row.slice() )
    const removedVals = []
    while (removedVals.length < holes) {
      val = Math.floor(Math.random() * 82) // Value between 0-81
      randomRowIndex = Math.floor(val / 10)
      randomColIndex = val % 9
      if ( startingBoard[ randomRowIndex ][ randomColIndex ] == 0 ) continue
      
      removedVals.push({
        rowIndex: randomRowIndex, 
        colIndex: randomColIndex, 
        val: startingBoard[ randomRowIndex ][ randomColIndex ] 
      })
      startingBoard[ randomRowIndex ][ randomColIndex ] = 0
  
      if ( !fillPuzzle( startingBoard.map ( row => row.slice() ) ) ) {
        startingBoard[ randomRowIndex ][ randomColIndex ] = removedVals.slice(-1).val
        removedVals.pop()
      }
    }
    return [removedVals, startingBoard]
  }
  
  const newStartingBoard = holes => {
    const solvedBoard = newSolvedBoard()
    const [removedVals, startingBoard] = pokeHoles(solvedBoard, holes)
  }