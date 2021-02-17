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
``
const boardUrl = "http://localhost:3000/boards"
const userBoardUrl = "http://localhost:3000/user_boards"
const userUrl = "http://localhost:3000/users"
const loginUrl = "http://localhost:3000/login"

function fetchUserInfoByName(usersName) {
    return fetch( `${ loginUrl }?name=${ usersName }` )
    .then( response => response.json() );
}

function fetchBoard( boardId ) {
    return fetch( `${ boardUrl }/${ boardId }` )
        .then( response => response.json() );
}

function patchBoard( boardId, config ) {
    return fetch( `${ boardUrl }/${ boardId }`, config )
        .then( response => response.json() );
}

function postNewBoard( newBoardConfig ) {
    return fetch( boardUrl, newBoardConfig )
        .then( response => response.json() )
}

function postNewUserBoard( userId, boardId ) {
    return fetch( userBoardUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( { user_id: userId, board_id: boardId } )  
    } )
}

function patchUserBoard( userBoardConfig ) {}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

let currentUserId = 1;

let removedValues = [];

let startingBoard = [];
let solution = [];

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

const modalBackground = document.querySelector('#modal-background')
const modalContainer = document.querySelector('#modal-container')


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
    cellInput.target.classList.remove( "incorrect" );
    let currentValue = cellInput.target.value
    if (cellInput.target.value === "") return
    if (cellInput.data === "e") {
        return cellInput.target.value = ""
    }
    cellInput.target.value = /\d$/.exec(`${currentValue}`)[0]
} 

function clearCell (cellNode) {
    cellNode.value = ""
    cellNode.classList = "cell-display"
    cellNode.disabled = false
}

function fillBoard( boardArray ) {
    for ( const row of [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
        for ( const column of [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] ) {
            const thisCellDisplay = allCells[ row ][ column ].querySelector( "input" );
            clearCell(thisCellDisplay)
            if ( boardArray[ row ][ column ] ) {
                thisCellDisplay.value = boardArray[ row ][ column ];
                if ( startingBoard[ row ][ column ] ) {
                    thisCellDisplay.classList.add( "clue" );
                    thisCellDisplay.disabled = true;
                }
            }
        }
    }
}

function renderBoard( boardData ) {
    sudokuBoard.dataset.id = boardData.id;
    removedValues = boardData.removed_values;
    startingBoard = boardData.starting_board;
    solution = boardData.solved_board;
    fillBoard( boardData.board_in_progress );
}

function createNewGame(newGameSubmit) {
    newGameSubmit.preventDefault()
    const newGameForm = newGameSubmit.target
    const holes = parseInt(newGameForm.difficulty.value), boardName = newGameForm.board_name.value
    const [removedVals, startingBoard, solvedBoard] = newStartingBoard(holes)
    
    const newBoardData = {
        board_name: boardName,
        starting_board: startingBoard,
        board_in_progress: startingBoard,
        solved_board: solvedBoard,
        removed_values: removedVals,
        difficulty: holes
    }

    const newBoardConfig = {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(newBoardData)
    }
    postNewBoard( newBoardConfig ).then( boardData => {
        renderBoard( boardData );
        postNewUserBoard( currentUserId, boardData.id )

    } );
    newGameForm.reset()
    modalContainer.classList.toggle( 'hidden' )
    modalBackground.classList.toggle( 'hidden' )
}


function saveProgress() {
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

function checkBoardProgress () {
    for( const removedValue of removedValues ) {
        const thisCell = allCells[ removedValue.rowIndex ][ removedValue.colIndex ];
        if ( thisCell.firstChild.value != removedValue.val && !!thisCell.firstChild.value ) {
            thisCell.firstChild.classList.add( "incorrect" );
        }
    }
}

function clearGuesses() {
    fillBoard( startingBoard );
}

function solvePuzzle() {
    for( const removedValue of removedValues ) {
        const thisCell = allCells[ removedValue.rowIndex ][ removedValue.colIndex ];
        thisCell.firstChild.value = removedValue.val;
        thisCell.firstChild.classList.add( "solution" );
        thisCell.firstChild.disabled = true;
    }
}

function renderLogin () {
    const loginForm = document.createElement( 'form' )
    loginForm.id = "login-form"
    const usersName = document.createElement( 'input' )
    usersName.id = "name-input"
    usersName.name = "name"
    usersName.placeholder = "Enter Your Name"
    usersName.required = true
    const loginButton = document.createElement( 'input' )
    loginButton.type = "submit"
    loginButton.textContent = "Login"

    const loginTitle = document.createElement('h1')
    loginTitle.textContent = "What's your name?"
    loginTitle.className = "login-title"

    loginForm.append(loginTitle, usersName, loginButton)
    modalContainer.append( loginForm )
}

function logUserIn (formSubmitEvent) {
    formSubmitEvent.preventDefault()
    const usersName = formSubmitEvent.target.name.value
    fetchUserInfoByName( usersName ).then( userData => {
        formSubmitEvent.target.reset()
        currentUserId = userData.id
        renderUserBoards( userData ) 
        document.getElementById('login-form').classList.toggle( 'hidden' )
    })
}

function renderUserBoards (userData) {
    const listOfBoards = document.createElement("ul")
    listOfBoards.id = "users-boards-list"
    const newGameForm = document.createElement('form')
    newGameForm.id = 'new-game-form'

    const newGameName = document.createElement('input')
    newGameName.name = "board_name"
    newGameName.placeholder = "Enter New Game Name"
    newGameName.required = true

    const newGameDifficultyLabel = document.createElement('label')
    newGameDifficultyLabel.name = 'difficulty'
    newGameDifficultyLabel.textContent = 'Select the number of empty spaces to generate.'

    
    const newGameDifficulty = document.createElement('input')
    newGameDifficulty.type = 'range'
    newGameDifficulty.name = "difficulty"
    newGameDifficulty.min = 10
    newGameDifficulty.max = 60
    newGameDifficulty.value = 40
    
    const newGameDifficultyValue = document.createElement('span')
    newGameDifficultyValue.textContent = 'Holes: 40'
    newGameDifficulty.oninput = function(){ newGameDifficultyValue.textContent = `Holes: ${newGameDifficulty.value}`}

    const newGameButton = document.createElement('input')
    newGameButton.type = "submit"
    newGameButton.id = 'modal-new-game'
    newGameButton.textContent = "Start a New Game!"

    newGameForm.append(newGameName, newGameDifficultyLabel, newGameDifficulty, newGameDifficultyValue, newGameButton)
    
    if (!userData.user_boards.length) {
        const newGamePrompt = document.createElement('p')
        newGamePrompt.textContent = "You have no recent games. Start one now!"
        modalContainer.append(newGamePrompt)
    }

    for (const userBoard of userData.user_boards) {
        const thisBoard = document.createElement('li')
        thisBoard.className = "user-board"
        thisBoard.dataset.userBoardId = userBoard.id
        thisBoard.dataset.boardId = userBoard.board_id
        thisBoard.textContent = `${userBoard.board_name} - Difficulty: ${userBoard.difficulty}`
        listOfBoards.append(thisBoard)
    }
    modalContainer.append(listOfBoards, newGameForm)
}

function handleFormSubmit ( formSubmitEvent ) {
    switch ( true ) {
        case ( formSubmitEvent.target.id === "login-form"):
            logUserIn(formSubmitEvent)
            break
        case ( formSubmitEvent.target.id === 'new-game-form'):
            createNewGame(formSubmitEvent)
            break
    }
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener( "DOMContentLoaded", () => {
    // fetchBoard( 1 ).then( renderBoard );
    ///////////// Handling board clicks /////////////
    modalContainer.addEventListener('submit', handleFormSubmit)
    ///////////// Handling navbar clicks /////////////
    document.getElementById( "save-game" ).addEventListener( "click", saveProgress );
    document.getElementById( "new-game" ).addEventListener( "click", createNewGame );
    ///////////// Handling controls clicks /////////////
    document.getElementById( "solve" ).addEventListener( "click", solvePuzzle);
    document.getElementById( "check-progress" ).addEventListener( "click", checkBoardProgress);
    document.getElementById( "clear-guesses" ).addEventListener( "click", clearGuesses);
    ///////////// Handling board clicks /////////////
    document.addEventListener( "click", handleDomClick );
    sudokuBoard.addEventListener( "click", highlightCellPeers );
    sudokuBoard.addEventListener( 'input', keepLastDigit )
    renderLogin()
} );

/*

Login Screen
- Type in User's Name
- Query Server to FInd user by name
- Server responds with Users Data

- UserData:
    - Set current user
    - populate "Load Screen" with UserBoards

*/