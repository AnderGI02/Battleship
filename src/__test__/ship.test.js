const { ShipFactory } = require("../Models/ShipFactory");

describe("Ship Factory Tests", () => {
  let defaultShip;
  let ship2;
  let ship5;
  //Test Only Public Interface
  // isSunk, receiveAttack
  beforeAll(() => {
    //Default param length equal to 3
    defaultShip = ShipFactory();
    ship2 = ShipFactory(2);
    ship5 = ShipFactory(5);
  });

  it("Tests the creation of multiple ships with different lengths", () => {
    expect(defaultShip.length).toBe(3);
    expect(ship2.length).toBe(2);
    expect(ship5.length).toBe(5);
  });

  it("Test if hitting exactly the length of the ship sinks it", () => {
    for (let i = 1; i <= 6; i++) {
      ship5.hit();
    }
    expect(ship5.isSunk()).toBe(true);
  });

  it("Test if surpassing the lenght of the ship in hits alters its sank situation", () => {
    for (let i = 1; i <= 4; i++) {
      ship2.hit();
    }

    expect(ship2.isSunk()).toBe(true);
  });

  describe("Test if ship is sunk with one hit at a time", () => {
    afterEach(() => {
      //Hit the ship
      defaultShip.hit();
    });
    it("Tests if the creation of length 3 ship is coorect. Not Sunk", () => {
      expect(defaultShip.isSunk()).toBe(false);
    });
    // First Hit
    it("After one hit is not sunk.", () => {
      expect(defaultShip.isSunk()).toBe(false);
    });
    // Second Hit
    it("After two hits is not sunk", () => {
      expect(defaultShip.isSunk()).toBe(false);
    });
    // Third Hit
    it("On the third the ship is sunk", () => {
      expect(defaultShip.isSunk()).toBe(true);
    });
  });
});
