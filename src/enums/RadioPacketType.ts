/**
 * Enum for types of data that a radio network packet can contain.
 */
enum RadioPacketType {
    MatchDataBroadcast = 0,
    MatchDataRequest = 1,
    ClientIDBroadcast = 2,
}

export default RadioPacketType;