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
let solution_count=0

const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i)

const checkGrid = grid => {
  for (const row of range(0,8) ) {
    for (const col of range(0,8) ) {
      if (grid[row][col] == 0) return false
    }
  }
  return true
}


const solveGrid = grid => {
  for (i of range(0,80) ) {
    const row = Math.floor(i/9)
    const col = i % 9
    // debugger
    if (grid[row][col] == 0 ){
      for (value of range (1,9) ) {
        if (grid[row].indexOf(value) === -1) {
          if ([grid[0][col],grid[1][col],grid[2][col],grid[3][col],grid[4][col],grid[5][col],grid[6][col],grid[7][col],grid[8][col]].indexOf(value) === -1 ) {
            let square = []
            if (row < 3) {
              if (col < 3 ) {
                square = [ grid[0][0], grid[0][1], grid[0][2], grid[1][0], grid[1][1], grid[1][2], grid[2][0], grid[2][1], grid[2][2] ]
              } else if ( col < 6) {
                square = [ grid[3][0], grid[3][1], grid[3][2], grid[4][0], grid[4][1], grid[4][2], grid[5][0], grid[5][1], grid[5][2] ]
              } else {
                square = [ grid[6][0], grid[6][1], grid[6][2], grid[7][0], grid[7][1], grid[7][2], grid[8][0], grid[8][1], grid[8][2] ]
              }
            } else if (row < 6) {
              if (col < 3 ) {
                square = [ grid[0][3], grid[0][4], grid[0][5], grid[1][3], grid[1][4], grid[1][5], grid[2][3], grid[2][4], grid[2][5] ]
              } else if ( col < 6) {
                square = [ grid[3][3], grid[3][4], grid[3][5], grid[4][3], grid[4][4], grid[4][5], grid[5][3], grid[5][4], grid[5][5] ]
              } else {
                square = [ grid[6][3], grid[6][4], grid[6][5], grid[7][3], grid[7][4], grid[7][5], grid[8][3], grid[8][4], grid[8][5] ]
              }
            } else {
              if (col < 3 ) {
                square = [ grid[0][6], grid[0][7], grid[0][8], grid[1][6], grid[1][7], grid[1][8], grid[2][6], grid[2][7], grid[2][8] ]
              } else if ( col < 6) {
                square = [ grid[3][6], grid[3][7], grid[3][8], grid[4][6], grid[4][7], grid[4][8], grid[5][6], grid[5][7], grid[5][8] ]
              } else {
                square = [ grid[6][6], grid[6][7], grid[6][8], grid[7][6], grid[7][7], grid[7][8], grid[8][6], grid[8][7], grid[8][8] ]
              }
            }
            // debugger
            if (square.indexOf(value) === -1) {
              grid[row][col] = value
              if (checkGrid(grid)) {
                solution_count++
                break
              } else {
                if (solveGrid(grid) ) return true
              }
            }
          }
        }
        break
      }
    }
    grid[row][col] = 0
    debugger

    return false  
  }
}