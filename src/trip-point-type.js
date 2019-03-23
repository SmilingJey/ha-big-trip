const TripPointType = {
  [`taxi`]: {
    icon: `🚕`,
    name: `Taxi`,
    destinationText: `Taxi to`,
    isTransport: true,
  },
  [`bus`]: {
    icon: `🚌`,
    name: `Bus`,
    destinationText: `Bus to`,
    isTransport: true,
  },
  [`train`]: {
    icon: `🚂`,
    name: `Train`,
    destinationText: `Train to`,
    isTransport: true,
  },
  [`flight`]: {
    icon: `✈️`,
    name: `Flight`,
    destinationText: `Flight to`,
    isTransport: true,
  },
  [`check-in`]: {
    icon: `🏨`,
    name: `Hotel`,
    destinationText: `Check into`,
    isTransport: false,
  },
  [`sight-seeing`]: {
    icon: `🏛️`,
    name: `Sightseeing`,
    destinationText: `Sightseeing`,
    isTransport: false,
  }
};

export {TripPointType};
