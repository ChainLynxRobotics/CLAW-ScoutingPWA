/**
 * Enum for the team's human player location on the field. Can be None (e.g. the other alliances players are on instead), Source, or Amp.
 */
enum HumanPlayerLocation {
    Unknown = -1,
    None = 0,
    CoralStation = 1,
    Processor = 2,
}

export default HumanPlayerLocation;