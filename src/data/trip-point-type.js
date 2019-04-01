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
  [`ship`]: {
    icon: `🛳️`,
    name: `Ship`,
    destinationText: `Ship to`,
    isTransport: true,
  },
  [`transport`]: {
    icon: `🚊`,
    name: `Transport`,
    destinationText: `Transport to`,
    isTransport: true,
  },
  [`drive`]: {
    icon: `🚗`,
    name: `Drive`,
    destinationText: `Drive to`,
    isTransport: true,
  },
  [`check-in`]: {
    icon: `🏨`,
    name: `Hotel`,
    destinationText: `Check`,
    isTransport: false,
  },
  [`sightseeing`]: {
    icon: `🏛️`,
    name: `Sightseeing`,
    destinationText: `Sightseeing`,
    isTransport: false,
  },
  [`restaurant`]: {
    icon: `🍴`,
    name: `Restaurant`,
    destinationText: `Restaurant in`,
    isTransport: false,
  },
};

export default TripPointType;
