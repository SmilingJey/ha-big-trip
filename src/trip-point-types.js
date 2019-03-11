const TRIP_POINT_TYPES = [
  `taxi`,
  `bus`,
  `train`,
  `flight`,
  `check-in`,
  `sightseeing`,
];

const TRIP_POINT_ICONS = {
  [`taxi`]: `🚕`,
  [`bus`]: `🚌`,
  [`train`]: `🚂`,
  [`ship`]: `🛳️`,
  [`transport`]: `🚊`,
  [`drive`]: `🚗`,
  [`flight`]: `✈️`,
  [`check-in`]: `🏨`,
  [`sightseeing`]: `🏛️`,
  [`sight-seeing`]: `🏛`,
  [`restaurant`]: `🍴`,
};

const TRIP_POINT_DESTINATION_TEXT = {
  [`taxi`]: `Taxi to`,
  [`bus`]: `Bus to`,
  [`train`]: `Train to`,
  [`ship`]: `Ship to`,
  [`transport`]: `Transport to`,
  [`drive`]: `Drive to`,
  [`flight`]: `Flight to`,
  [`check-in`]: `Check into`,
  [`sightseeing`]: `Sightseeing`,
  [`restaurant`]: `Dinner in`,
};

export {TRIP_POINT_TYPES, TRIP_POINT_ICONS, TRIP_POINT_DESTINATION_TEXT};
