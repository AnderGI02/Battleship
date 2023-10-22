const hitExtension = (ship) => ({
  hits: 0,
  hit() {
    ship.hits++;
  },
});

const isSunkExtension = (ship) => ({
  isSunk() {
    return ship.hits >= ship.length;
  },
});

const extensionArray = [hitExtension, isSunkExtension];

const extensionProto = (basicShipData) => {
  const basicObjData = Object.assign({}, basicShipData);
  for (const extension of extensionArray) {
    Object.assign(basicObjData, extension(basicObjData));
  }
  return basicObjData;
};

const ShipFactory = (shipLength) => {
  const basicData = {
    length: !shipLength ? 3 : shipLength,
  };
  return extensionProto(basicData);
};

module.exports = {
  ShipFactory,
};
