const createBoard = (rows, cols) => {
  const board = [];
  for (let i = 1; i <= rows; i++) {
    const row = [];
    for (let j = 1; j <= cols; j++) {
      const col = 0;
      row.push(col);
    }
    board.push(row);
  }
  return board;
};

// Place ship extension
// This function will be called by the controller which will
// be the one to handle all user interactions
// This fucntion wont be the one to handle the validation process
// of the ship starting from a incorrect coordinate
// it will just place it taking into account the ship, the starting point
// and direction (vertical / horizontal)
// In startingCoordinates { row : ?, col : ?} INDEXES OF ARRAY
const placeShipExtension = (gameboardObj) => ({
  placeShip({ ship, startingCoordinates, direction }) {
    // For inmutability reasons get a shallow copy of the outer and inner arrays
    const board = gameboardObj.board.map((row) => [...row]);
    const { row, col } = startingCoordinates;
    const { length } = ship;
    if (direction === "vertical") {
      for (let i = row; i < row + length; i++) {
        board[i][col] = 1;
      }
    } else {
      for (let i = col; i < col + length; i++) {
        board[row][i] = 1;
      }
    }
    return board;
  },
});

const isStartingCoordinateCorrectExtension = (gameboardObj) => ({
  isStartingCoordinateCorrect({
    ship = 5,
    startingCoordinates,
    direction = "horizontal",
  }) {
    const { length } = ship;
    const { board } = gameboardObj;
    const { row, col } = startingCoordinates;
    // Gameboard boundaries
    if (row < 0 || col < 0) return false;
    if (row > board.length - 1) return false;
    if (col > board[row].length - 1) return false;

    // compare by index
    // take one from the length because the first position is the one that the
    // coordinates specify so we start adding taking that also into account
    if (direction === "vertical") {
      return row + (length - 1) <= board.length - 1;
    } else if (direction === "horizontal") {
      return col + (length - 1) <= board[row].length - 1;
    }
  },
});

const extensions = [placeShipExtension, isStartingCoordinateCorrectExtension];

const extensionPrototype = (basicData) => {
  const extensionProto = Object.assign({}, basicData);
  for (const extension of extensions) {
    Object.assign(extensionProto, extension(extensionProto));
  }
  return extensionProto;
};

const GameboardFactory = (rows = 10, cols = 10) => {
  const basicData = {
    board: createBoard(rows, cols),
  };

  return Object.assign(basicData, extensionPrototype(basicData));
};

module.exports = {
  GameboardFactory,
};
