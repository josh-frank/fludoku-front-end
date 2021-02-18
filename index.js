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
const userBoardUrl = "http://localhost:3000/user_boards"
const userUrl = "http://localhost:3000/users"
const loginUrl = "http://localhost:3000/login"

function fetchUserInfoByName(usersName) {
    return fetch( `${ loginUrl }?name=${ usersName }` )
    .then( response => response.json() );
}

function fetchUserInfoById( userId ) {
    return fetch( `${ userUrl }/${ userId }` )
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

function deleteBoard( boardId ) {
    return fetch( `${ boardUrl }/${ boardId }`, { method: "DELETE" } );
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
    } ).then( response => response.json() )
}

function patchUserBoard( userBoardID, userBoardConfig ) {
    return fetch( `${userBoardUrl}/${userBoardID}`, userBoardConfig)
        .then(response => response.json() ) 
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

let currentUserId = 1;

let removedValues = [];
let startingBoard = [];
let boardInProgress = []
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

const modalBackground = document.querySelector('#modal-background');
const modalContainer = document.querySelector('#modal-container');

const boardNameDisplay = document.getElementById( "board-name" );
const changeBoardNameButton = document.getElementById( "change-board-name-button" );

function beltLevel( points ) {
    switch ( true ) {
        case ( points <= 20 ): return "White";
        case ( 20 <= points < 50 ): return "Red";
        case ( 50 <= points < 100 ): return "Blue";
        case ( 100 <= points < 200 ): return "Purple";
        case ( 200 <= points < 300 ): return "Green";
        case ( 300 <= points < 500 ): return "Brown";
        case ( 500 <= points ): return "Black";
    }
}

function toggleModalContainer() {
    modalContainer.classList.toggle( 'hidden' );
    modalBackground.classList.toggle( 'hidden' );
}

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
    document.getElementById( "board-name" ).value = boardData.board_name;
    sudokuBoard.dataset.id = boardData.id;
    removedValues = boardData.removed_values;
    startingBoard = boardData.starting_board;
    solution = boardData.solved_board;
    boardInProgress = boardData.board_in_progress
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
        postNewUserBoard( currentUserId, boardData.id ).then( userBoardData => {
            sudokuBoard.dataset.userBoardId = userBoardData.id;
            sudokuBoard.dataset.solved = userBoardData.solved;
            renderBoard( boardData );
        } );

    } );
    newGameForm.reset()
    toggleModalContainer();
}

function openLoadWindow() {
    toggleModalContainer();
    modalContainer.querySelector( "ul#users-boards-list" ).remove();
    modalContainer.querySelector( "form#new-game-form" ).remove();
    fetchUserInfoById( currentUserId ).then( renderUserBoards );
}

function toggleChangeNameForm() {
    boardNameDisplay.disabled = boardNameDisplay.disabled ? false : true;
    changeBoardNameButton.classList.toggle( "hidden" );
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
    boardInProgress = updatedBoardInProgress;
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
    if ( sudokuBoard.dataset.solved === "true" ) return
    fillBoard( boardInProgress );
}

function changeBoardName( changeNameFormSubmission ) {
    changeNameFormSubmission.preventDefault();
    patchBoard( parseInt( sudokuBoard.dataset.id ), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( { board_name: boardNameDisplay.value } )
    } ).then( toggleChangeNameForm );
}

function markPuzzleAsSolved() {
    const userBoardId = sudokuBoard.dataset.userBoardId
    const patchUserBoardConfig = {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            solved: true,
            failed: true
        })
    }

    return patchUserBoard( userBoardId, patchUserBoardConfig )
}

function renderSolution () {
    for( const removedValue of removedValues ) {
        const thisCell = allCells[ removedValue.rowIndex ][ removedValue.colIndex ];
        thisCell.firstChild.value = removedValue.val;
        thisCell.firstChild.classList.add( "solution" );
        thisCell.firstChild.disabled = true;
        sudokuBoard.dataset.solved = true
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
        document.getElementById( "username" ).textContent = userData.name;
        document.getElementById( "level" ).textContent = beltLevel( userData.points );
        document.getElementById( "points" ).textContent = userData.points;
        currentUserId = userData.id;
        renderUserBoards( userData );
        document.getElementById( 'login-form' ).classList.toggle( 'hidden' );
        document.getElementById( "player-info" ).classList.toggle( "hidden" );
    } )
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
    
    if ( !userData.user_boards.length ) {
        const newGamePrompt = document.createElement('p')
        newGamePrompt.textContent = "You have no recent games. Start one now!"
        modalContainer.append(newGamePrompt)
    }

    for ( const userBoard of userData.user_boards ) {
        const thisBoard = document.createElement('li')
        thisBoard.className = "user-board"
        thisBoard.dataset.userBoardId = userBoard.id
        thisBoard.dataset.boardId = userBoard.board_id
        thisBoard.dataset.solved = userBoard.solved
        thisBoard.dataset.failed = userBoard.failed
        thisBoard.textContent = `${userBoard.board_name} - Difficulty: ${userBoard.difficulty}`
        const loadThisBoardButton = document.createElement( "button" );
        loadThisBoardButton.textContent = "Load"
        loadThisBoardButton.classList.add( "load-button" )
        const deleteThisBoardButton = document.createElement( "button" );
        deleteThisBoardButton.textContent = "Delete"
        deleteThisBoardButton.classList.add( "delete-button" )
        thisBoard.append( loadThisBoardButton, deleteThisBoardButton );
        listOfBoards.append( thisBoard )
    }
    modalContainer.append(listOfBoards, newGameForm)
}

function getHint () {
    if ( sudokuBoard.dataset.solved === "true" ) return
    let valueFound = false
    let randomIndex, randomRow, randomColumn
    while (!valueFound) {
        randomIndex = Math.floor(Math.random() * removedValues.length)
        randomRow = removedValues[randomIndex].rowIndex
        randomColumn = removedValues[randomIndex].colIndex
        valueFound = !allCells[randomRow][randomColumn].firstChild.value
    }
        let value = removedValues[randomIndex].val
        if (allCells[randomRow][randomColumn].firstChild.value) getHint()
        allCells[randomRow][randomColumn].firstChild.value = value
        allCells[randomRow][randomColumn].firstChild.classList.add('hint')
        saveProgress()
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

function handleModalClick( modalClickEvent ) {
    const clickTarget = modalClickEvent.target;
    const thisUserBoard = clickTarget.closest( "li" )
    switch ( true ) {
        case ( clickTarget.classList.contains( "load-button" ) ):
            fetchBoard( parseInt( thisUserBoard.dataset.boardId ) ).then( boardData => {
                sudokuBoard.dataset.userBoardId = thisUserBoard.dataset.userBoardId
                sudokuBoard.dataset.solved = thisUserBoard.dataset.solved
                renderBoard(boardData) 
                if (thisUserBoard.dataset.failed === "true") renderSolution()
            });
            toggleModalContainer();
            break;
        case ( clickTarget.classList.contains( "delete-button" ) ):
            deleteBoard( parseInt( thisUserBoard.dataset.boardId ) );
            thisUserBoard.remove();
            break;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener( "DOMContentLoaded", () => {
    // fetchBoard( 1 ).then( renderBoard );
    ///////////// Handling board clicks /////////////
    modalContainer.addEventListener('submit', handleFormSubmit)
    modalContainer.addEventListener('click', handleModalClick)
    ///////////// Handling navbar clicks /////////////
    document.getElementById( "load-game" ).addEventListener( "click", openLoadWindow );
    document.getElementById( "edit-game" ).addEventListener( "click", toggleChangeNameForm );
    document.getElementById( "save-game" ).addEventListener( "click", saveProgress );
    ///////////// Handling controls clicks /////////////
    document.getElementById( "change-board-name-form" ).addEventListener( "submit", changeBoardName );
    document.getElementById( "solve" ).addEventListener( "click", () => { markPuzzleAsSolved().then( renderSolution ) });
    document.getElementById( "get-hint" ).addEventListener( "click", getHint);
    document.getElementById( "check-progress" ).addEventListener( "click", checkBoardProgress);
    document.getElementById( "clear-guesses" ).addEventListener( "click", clearGuesses);
    ///////////// Handling board clicks /////////////
    document.addEventListener( "click", handleDomClick );
    sudokuBoard.addEventListener( "click", highlightCellPeers );
    sudokuBoard.addEventListener( 'input', keepLastDigit )
    renderLogin()
} );

/*
ToDo 2/18
- define and implement a points system
- handle wins
- add some slicker styling
- alert user when game is saved/won
- add a working timer
*/