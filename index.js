function peers( puzzle, row, column ) {
    let result = puzzle[ row ];
    const topLeftCorner = [ Math.floor( row / 3 ) * 3, Math.floor( column / 3 ) * 3];
    result = result.concat( puzzle.map( row => row[ column ] ) );
    result = result.concat( [ puzzle[ topLeftCorner[ 0 ] ][ topLeftCorner[ 1 ] ],
        puzzle[ topLeftCorner[ 0 ] ][ topLeftCorner[ 1 ] + 1 ],
        puzzle[ topLeftCorner[ 0 ] ][ topLeftCorner[ 1 ] + 2 ],
        puzzle[ topLeftCorner[ 0 ] + 1 ][ topLeftCorner[ 1 ] ],
        puzzle[ topLeftCorner[ 0 ] + 1 ][ topLeftCorner[ 1 ] + 1 ],
        puzzle[ topLeftCorner[ 0 ] + 1 ][ topLeftCorner[ 1 ] + 2 ],
        puzzle[ topLeftCorner[ 0 ] + 2 ][ topLeftCorner[ 1 ] ],
        puzzle[ topLeftCorner[ 0 ] + 2 ][ topLeftCorner[ 1 ] + 1 ],
        puzzle[ topLeftCorner[ 0 ] + 2 ][ topLeftCorner[ 1 ] + 2 ] ] );
    result = result.filter( digit => !!digit );
    return [ ...new Set( result ) ];
}

/* function peers( puzzle, row, column ) {
    const topLeftCorner = [ Math.floor( row / 3 ) * 3, Math.floor( column / 3 ) * 3];
    return [ ...new Set( puzzle[ row ].concat( puzzle.map( row => row[ column ] ) ).concat( [ puzzle[ topLeftCorner[ 0 ] ][ topLeftCorner[ 1 ] ], puzzle[ topLeftCorner[ 0 ] ][ topLeftCorner[ 1 ] + 1 ], puzzle[ topLeftCorner[ 0 ] ][ topLeftCorner[ 1 ] + 2 ], puzzle[ topLeftCorner[ 0 ] + 1 ][ topLeftCorner[ 1 ] ], puzzle[ topLeftCorner[ 0 ] + 1 ][ topLeftCorner[ 1 ] + 1 ], puzzle[ topLeftCorner[ 0 ] + 1 ][ topLeftCorner[ 1 ] + 2 ], puzzle[ topLeftCorner[ 0 ] + 2 ][ topLeftCorner[ 1 ] ], puzzle[ topLeftCorner[ 0 ] + 2 ][ topLeftCorner[ 1 ] + 1 ], puzzle[ topLeftCorner[ 0 ] + 2 ][ topLeftCorner[ 1 ] + 2 ] ] ).filter( digit => !!digit ) ) ];
} */

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

const boardUrl = "http://localhost:3000/boards"

function fetchBoard( boardId ) {
    return fetch( `${ boardUrl }/${ boardId }` )
        .then( response => response.json() );
}

function patchBoard( boardId, config ) {
    return fetch( `${ boardUrl }/${ boardId }`, config )
        .then( response => response.json() );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

const sudokuBoard = document.getElementById( "sudoku-board" );

const allCells = [
    [ ...document.querySelector( '[data-row="0"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="1"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="2"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="3"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="4"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="5"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="6"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="7"]' ).getElementsByTagName( "td" ) ],
    [ ...document.querySelector( '[data-row="8"]' ).getElementsByTagName( "td" ) ],
]

function clearHighlight() {
    allCells.flat().forEach( cell => cell.classList.remove( "highlight" ) );
}

function handleDomClick( documentClick ) {
    if ( documentClick.target.tagName != "INPUT" ) { clearHighlight(); }
}

function highlightCellPeers( cellClick ) {
    if ( cellClick.target.tagName === "INPUT" ) {
        clearHighlight();
        peers( allCells, parseInt( cellClick.target.closest( "tr" ).dataset.row ), parseInt( cellClick.target.dataset.column ) ).forEach( peer => peer.classList.add( "highlight" ) );
    }
}

function keepLastDigit (cellInput) {
    let currentValue = cellInput.target.value
    if (cellInput.data === "e") {
        return cellInput.target.value = ""
    }
    cellInput.target.value = /\d$/.exec(`${currentValue}`)[0]
}

function renderBoard( boardData ) {
    for ( const row of [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
        for ( const column of [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
            if ( boardData.board_in_progress[ row ][ column ] ) {
                const thisCellDisplay = allCells[ row ][ column ].querySelector( "input" );
                thisCellDisplay.value = boardData.board_in_progress[ row ][ column ];
                thisCellDisplay.classList.add( "clue" );
                thisCellDisplay.disabled = true;
            }
        }
    }
    sudokuBoard.dataset.id = boardData.id;
}

function saveProgress( saveButtonClick ) {
    const updatedBoardInProgress = allCells.map( row => {
        return row.map( cell => {
            const updatedNumber = parseInt( cell.querySelector("input").value );
            return !updatedNumber ? 0 : updatedNumber;
        } )
    } );
    const progressConfig = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( { board_in_progress: updatedBoardInProgress } )
    };
    patchBoard( parseInt( sudokuBoard.dataset.id ), progressConfig ).then( console.log( "Saved" ) );
}

document.addEventListener( "DOMContentLoaded", () => {
    fetchBoard( 1 ).then( renderBoard );
    ///////////// Handling navbar clicks /////////////
    document.getElementById( "save-game" ).addEventListener( "click", saveProgress );
    ///////////// Handling board clicks /////////////
    document.addEventListener( "click", handleDomClick );
    sudokuBoard.addEventListener( "click", highlightCellPeers );
    sudokuBoard.addEventListener( 'input', keepLastDigit )
} );

