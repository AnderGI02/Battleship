const { declareExportDeclaration } = require("@babel/types");
const { GameboardFactory } = require("../Models/GameboardFactory");
const { ShipFactory } = require("../Models/ShipFactory");

describe("Gameboard Unit Tests", () => {
  let defaultGameboard;
  let gameboard7x7;
  let gameboard10x7;
  let length5Ship;
  let verticalPlacementData;
  let horizontalPlacementData;

  beforeAll(() => {
    defaultGameboard = GameboardFactory();
    gameboard7x7 = GameboardFactory(7, 7);
    gameboard10x7 = GameboardFactory(10, 7);

    length5Ship = ShipFactory(5);
    horizontalPlacementData = {
      ship: length5Ship,
      direction: "horizontal",
    };
    verticalPlacementData = {
      ship: length5Ship,
      direction: "vertical",
    };
  });

  describe("Test if gameboard has the right amount of rows and cols", () => {
    const testGameboard = (gameboard, rowsLenght, colsLength) => {
      const { board } = gameboard;
      expect(board.length).toBe(rowsLenght);
      expect(board.every((row) => row.length === colsLength)).toBe(true);
    };
    it("Default 10 by 10 gameboard", () => {
      testGameboard(defaultGameboard, 10, 10);
    });
    it("Custom 7 by 7 gameboard", () => {
      testGameboard(gameboard7x7, 7, 7);
    });
    it("Custom 10 by 7 gameboard", () => {
      testGameboard(gameboard10x7, 10, 7);
    });
  });

  describe("Test Starting Ship Coordinates", () => {
    it("Test correct horizontal starting point", () => {
      const correctHorizontalPlacement = {
        ...horizontalPlacementData,
        startingCoordinates: {
          row: 1,
          col: 1,
        },
      };
      expect(
        defaultGameboard.isStartingCoordinateCorrect(correctHorizontalPlacement)
      ).toBe(true);
    });
    it("Test correct vertical starting point", () => {
      const correctVerticalPlacement = {
        ...verticalPlacementData,
        startingCoordinates: {
          row: 1,
          col: 1,
        },
      };
      expect(
        defaultGameboard.isStartingCoordinateCorrect(correctVerticalPlacement)
      ).toBe(true);
    });
    it("Test incorrect horizontal starting point", () => {
      const incorrectHorizontalPlacement = {
        ...horizontalPlacementData,
        startingCoordinates: {
          row: 1,
          col: 8,
        },
      };
      expect(
        defaultGameboard.isStartingCoordinateCorrect(
          incorrectHorizontalPlacement
        )
      ).toBe(false);
    });
    it("Test incorrect vertical starting point", () => {
      const incorrectVerticalPlacement = {
        ...verticalPlacementData,
        startingCoordinates: {
          row: 8,
          col: 1,
        },
      };
      expect(
        defaultGameboard.isStartingCoordinateCorrect(incorrectVerticalPlacement)
      ).toBe(false);
    });
    it("Test correct vertical placement when ship hits the borders of the board", () => {
      // The tested ship has a length of 5
      // In horizontal and vertical should be index 5
      const verticalPlacement = {
        ...verticalPlacementData,
        startingCoordinates: {
          row: 5,
          col: 9,
        },
      };
      expect(
        defaultGameboard.isStartingCoordinateCorrect(verticalPlacement)
      ).toBe(true);
    });
    it("Test correct horizontal placement when ship hits the borders of the board", () => {
      // The tested ship has a length of 5
      // In horizontal and vertical should be index 5
      const horizontalPlacement = {
        ...horizontalPlacementData,
        startingCoordinates: {
          row: 5,
          col: 5,
        },
      };
      expect(
        defaultGameboard.isStartingCoordinateCorrect(horizontalPlacement)
      ).toBe(true);
    });
    it("Test that the starting point coordinates are between the board boundaries", () => {
      // The tested ship has a length of 5
      // In horizontal and vertical should be index 5
      const wrongPlacements = [
        {
          startingCoordinates: {
            row: -5,
            col: 5,
          },
        },
        {
          startingCoordinates: {
            row: 5,
            col: -5,
          },
        },
        {
          startingCoordinates: {
            row: -5,
            col: -5,
          },
        },
        {
          startingCoordinates: {
            row: 5,
            col: 5000,
          },
        },
        {
          startingCoordinates: {
            row: 5000,
            col: 5,
          },
        },
        {
          startingCoordinates: {
            row: 5000,
            col: 5000,
          },
        },
      ];
      expect(
        wrongPlacements.every((data) =>
          defaultGameboard.isStartingCoordinateCorrect(data)
        )
      ).toBe(false);
    });
  });

  describe("Gameboard ship placement", () => {
    it("It places vertical ships correctly within its boundaries", () => {
      // Genero data del placement del ship en vertical desde la segunda fila segunda col
      const verticalPositionShip = {
        ...verticalPlacementData,
        startingCoordinates: {
          row: 1,
          col: 1,
        },
      };
      // Posiciono el ship y devuelvo una representacion del board
      const updatedBoard = defaultGameboard.placeShip(verticalPositionShip);
      // Actualizo el board existente con el nuevo para mantener la inmutabilidad
      defaultGameboard = {
        ...defaultGameboard,
        board: updatedBoard,
      };

      const { board } = defaultGameboard;
      // Checkeo de segunda fila y segunda col
      // [1,1] [2,1] [3,1] [4,1] [5,1]
      expect(board[0][1]).not.toEqual(1);
      expect(board[1][1]).toEqual(1);
      expect(board[2][1]).toEqual(1);
      expect(board[3][1]).toEqual(1);
      expect(board[4][1]).toEqual(1);
      expect(board[5][1]).toEqual(1);
      expect(board[6][1]).not.toEqual(1);
    });

    it("It places horizontal ships correctly whithin its boundaries", () => {
      const horizontalShipPositioning = {
        ...horizontalPlacementData,
        startingCoordinates: {
          row: 2,
          col: 2,
        },
      };
      const updatedBoard = defaultGameboard.placeShip(
        horizontalShipPositioning
      );
      defaultGameboard = {
        ...defaultGameboard,
        board: updatedBoard,
      };
      const { board } = defaultGameboard;
      expect(board[2][1]).not.toEqual(1);
      expect(board[2][2]).toEqual(1);
      expect(board[2][3]).toEqual(1);
      expect(board[2][4]).toEqual(1);
      expect(board[2][5]).toEqual(1);
      expect(board[2][6]).toEqual(1);
      expect(board[2][7]).not.toEqual(1);
    });
  });
});
