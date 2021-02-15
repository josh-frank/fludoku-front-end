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

document.addEventListener( "DOMContentLoaded", () => {
    document.addEventListener( "click", handleDomClick );
    document.getElementById( "sudoku-board" ).addEventListener( "click", highlightCellPeers );
    document.getElementById( "sudoku-board" ).addEventListener('input', keepLastDigit)
} );

