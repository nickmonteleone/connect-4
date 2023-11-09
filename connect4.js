"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
// (board[5][0] would be the bottom-left spot on the board)


/** makeBoard: fill in global `board`:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *  no inputs because using global constants, no return because modifying global
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  console.log("starting makeBoard");

  // more efficient way to do using Array.from()
  const row = [];
  for (let x = 0; x < WIDTH; x++) {
    row.push(null);
  }

  // more efficient way to do using Array.from()
  for (let y = 0; y < HEIGHT; y++) {
    board.push(row.slice());
  }

  console.log("makeBoard complete", board);
}


/** makeHtmlBoard: make HTML table and row of column tops.
 * No inputs bc using global board, no return bc interacting with DOM
*/

function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  console.log("Starting HTML board");

  // Make element for top row
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");

  // Make cell element for each column in top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", `top-${x}`);
    headCell.addEventListener("click", handleClick);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row


  for (let y = 0; y < HEIGHT; y++) {
    // Create a table row element and assign to a "row" variable
    const row = document.createElement('tr');
    row.setAttribute("id", `r-${y}`);
    for (let x = 0; x < WIDTH; x++) {
      // Create a table cell element and assign to a "cell" variable
      const cell = document.createElement('td');
      cell.setAttribute("id", `c-${y}-${x}`);
      // add an id, c-y-x, to the above table cell element
      // (for example, for the cell at y=2, x=3, the ID should be "c-2-3")

      // append the table cell to the table row
      row.append(cell);

    }
    // append the row to the html board
    htmlBoard.append(row);
  }
  console.log("Ending HTML board");
}

/** findSpotForCol: given column x, return y coordinate of furthest-down spot
 *    (return null if filled) */

function findSpotForCol(x) {
  // note: swapped from top-to-bottom to bottom-to-top
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {

  // Make a div and insert into correct table cell
  const cell = document.getElementById(`c-${y}-${x}`);
  const piece = document.createElement('div');
  piece.classList.add('piece', `p${currPlayer}`);
  cell.append(piece);

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  console.log('checking for win');

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // Check four cells to see if they're all legal & all color of current
    // player

    // simpler version from solution to only have return compare statement
    return cells.every(
      ([y,x]) =>
        x >= 0 &&
        y >= 0 &&
        x < WIDTH &&
        y < HEIGHT &&
        board[y][x] === currPlayer
    );
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
  return false;
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = Number(evt.target.id.slice("top-".length));

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // update global `board` variable with new piece
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }
  else {
    console.log('Checked and no win found!')
  }

  // check for tie: if top row is filled, board is filled
  // check if all cells in board are filled; if so, call endGame
  if (board[0].every(x => x !== null)) {
    return endGame(`All boxes filled. No winner!`);
  }

  // switch players
  // switch currPlayer 1 <-> 2


  currPlayer = currPlayer === 1  ? 2 : 1;
}

/** Start game. */

function start() {
  makeBoard();
  makeHtmlBoard();
}

start();