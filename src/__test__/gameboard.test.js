const { GameboardFactory } = require("../Models/GameboardFactory");
const { ShipFactory } = require("../Models/ShipFactory");

const testGameboard = (gameboard, rowsLenght, colsLength) => {
  const { board } = gameboard;
  expect(board.length).toBe(rowsLenght);
  expect(board.every((row) => row.length === colsLength)).toBe(true);
};

const createShipPlacementBaseData = (length, isVertical) => {
  return {
    ship: ShipFactory(length),
    direction: isVertical ? "vertical" : "horizontal",
  };
};

const isStartingCoordinateCorrect = (gameboard, data, booleanResult) =>
  expect(gameboard.isStartingCoordinateCorrect(data)).toBe(booleanResult);

const createShipPlacementData = (basePlacementData, row, col) => {
  return Object.assign({}, basePlacementData, {
    startingCoordinates: {
      row,
      col,
    },
  });
};

const validateStartingShipCoordinates = (
  shipLength,
  position,
  coordinateArray,
  gameboardArray,
  result
) => {
  const [rowIndex, colIndex] = coordinateArray;
  const [numRows, numCols] = gameboardArray;
  const gameboard = GameboardFactory(numRows, numCols);
  const baseData = createShipPlacementBaseData(
    shipLength,
    position === "vertical"
  );
  const placementData = createShipPlacementData(baseData, rowIndex, colIndex);
  isStartingCoordinateCorrect(gameboard, placementData, result);
};

const testShipSpreading = ({ gameboard, shipInfo, shipSpreading }) => {
  const { ship, isVertical } = shipInfo;
  const { start, end } = shipSpreading;
  const { startRow, startCol } = start;
  const { endRow, endCol } = end;
  const updatedBoard = gameboard.placeShip({
    ship: ship,
    startingCoordinates: start,
    direction: isVertical ? "vertical" : "horizontal",
  });

  gameboard = {
    ...gameboard,
    board: updatedBoard,
  };

  const startLoop = isVertical ? startRow : startCol;
  const endLoop = isVertical ? endRow : endCol;

  for (let i = startLoop; i <= endLoop; i++) {
    if (isVertical) {
      expect(gameboard[i][startCol]).toBe(1);
    } else {
      expect(gameboard[startRow][i]).toBe(1);
    }
  }

  // Test for the cells that shouldn't be covered
  for (let i = 0; i < gameboard.length; i++) {
    for (let j = 0; j < gameboard[i].length; j++) {
      if (i < startRow || i > endRow || j < startCol || j > endCol) {
        // Cells outside the ship's range should not be 1
        expect(gameboard[i][j]).toBe(0);
      }
    }
  }
};

describe("Gameboard Unit Tests", () => {
  describe("Test if gameboard has the right amount of rows and cols", () => {
    // DEFAULT (default params) = 10 x 10
    let defaultGameboard = GameboardFactory();
    let gameboard7x7 = GameboardFactory(7, 7);
    let gameboard10x7 = GameboardFactory(10, 7);
    it("Default 10 by 10 gameboard", () =>
      testGameboard(defaultGameboard, 10, 10));
    it("Custom 7 by 7 gameboard", () => testGameboard(gameboard7x7, 7, 7));
    it("Custom 10 by 7 gameboard", () => testGameboard(gameboard10x7, 10, 7));
  });

  describe("Validate Starting Ship Coordinates", () => {
    it.each([
      // LENGTH POSITION COORDINATES (row and col indexes) GAMEBOARD (number of rows and cols) RESULT
      [5, "vertical", [1, 1], [4, 7], false], // Good positioning V
      [5, "horizontal", [3, 4], [8, 10], true], // Good positioning H
      [4, "horizontal", [2, 2], [3, 6], true], // HITS THE HORIZONTAL BORDER
      [4, "vertical", [3, 1], [7, 2], true], // HITS THE VERTICAL BORDER
      [5, "vertical", [1000, -10], [3, 3], false], // STARTS OUT OF THE GAMEBOARD LIMIT
      [NaN, "bababbaba", [2, 3], [undefined, 5], false], // Invalid Data
    ])(
      `Test if ship of length %s being %s with a starting coordinate of %s in a Gameboard of %s rows and columns is %s`,
      validateStartingShipCoordinates
    );
  });

  describe("Gameboard whole ship placement", () => {
    const shipPlacements = [
      {
        description:
          "Test if a five length ship covers all but only the cells from [1,3] to [5,3] vertically",
        gameboard: GameboardFactory(10, 10),
        shipInfo: {
          ship: ShipFactory(5),
          isVertical: true,
        },
        shipSpreading: {
          start: {
            row: 1,
            col: 3,
          },
          end: {
            row: 5,
            col: 3,
          },
        },
      },
      {
        description:
          "Test if a five length ship covers all but only the cells from [1,3] to [1,6] horizontally",
        gameboard: GameboardFactory(10, 10),
        shipInfo: {
          ship: ShipFactory(4),
          isVertical: false,
        },
        shipSpreading: {
          start: {
            row: 1,
            col: 3,
          },
          end: {
            row: 1,
            col: 6,
          },
        },
      },
    ];

    shipPlacements.forEach(
      ({ description, gameboard, shipInfo, shipSpreading }) => {
        it(description, () =>
          testShipSpreading({ gameboard, shipInfo, shipSpreading })
        );
      }
    );
  });
});
