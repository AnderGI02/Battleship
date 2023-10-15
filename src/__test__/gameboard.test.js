const { declareExportDeclaration } = require("@babel/types");
const { GameboardFactory } = require("../Models/GameboardFactory");
const { ShipFactory } = require("../Models/ShipFactory");

describe("Gameboard Unit Tests", () => {
  let defaultGameboard;
  let gameboard7x7;
  let gameboard10x7;
  // let defaultShip;
  //let defaultHorizontalShipData;
  //let defaultVerticalShipData;
  beforeAll(() => {
    // defaultShip = ShipFactory();
    defaultGameboard = GameboardFactory();
    gameboard7x7 = GameboardFactory(7, 7);
    gameboard10x7 = GameboardFactory(10, 7);
    // defaultHorizontalShipData = {
    //   ship: defaultShip,
    //   startingCoordinates: {
    //     row: 2,
    //     col: 4,
    //   },
    //   direction: "horizontal",
    // };
    // defaultVerticalShipData = {
    //   ship: defaultShip,
    //   startingCoordinates: {
    //     row: 3,
    //     col: 1,
    //   },
    //   direction: "vertical",
    // };
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
    let length5Ship;
    let verticalPlacementData;
    let horizontalPlacementData;
    beforeAll(() => {
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
    // Negative numbers
    // Rows and cols bigger than the board borders
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

  /*  
  describe("Gameboard ship placement", () => {
    describe("Vertical placement", () => {
      it("It places vertical ships correctly", () => {
        const updatedBoard = defaultGameboard.placeShip(
          defaultVerticalShipData
        );
        defaultGameboard = {
          ...defaultGameboard,
          board: updatedBoard,
        };
        const { board } = defaultGameboard;
        expect(board[3][1]).toEqual(1);
        expect(board[4][1]).toEqual(1);
        expect(board[5][1]).toEqual(1);
      });

      it("Test if ships dont surpase their vertical length limit when placed", () => {
        const { board } = defaultGameboard;
        expect(board[2][1]).not.toEqual(1);
        expect(board[6][1]).not.toEqual(1);
        expect(board[7][1]).not.toEqual(1);
      });
    });

    describe("Horizontal Placement", () => {
      it("It places horizontal ships correctly", () => {
        const updatedBoard = defaultGameboard.placeShip(
          defaultHorizontalShipData
        );
        defaultGameboard = {
          ...defaultGameboard,
          board: updatedBoard,
        };
        const { board } = defaultGameboard;
        expect(board[2][4]).toEqual(1);
        expect(board[2][5]).toEqual(1);
        expect(board[2][6]).toEqual(1);
      });
      it("Test if ships dont surpase their horizontal length limit when placed", () => {
        const { board } = defaultGameboard;
        expect(board[2][3]).not.toEqual(1);
        expect(board[2][7]).not.toEqual(1);
        expect(board[2][8]).not.toEqual(1);
      });
    });
  });
  */
});

// OVERLAPPING SHIPS
// PLACE A SHIP WHEN BOARD IS FULL
// SHIP SHOULD BE COMPLETELY PLACED IN A ROW VETICALLY OR HORIZONTALLY WITHOUT BREAKING
