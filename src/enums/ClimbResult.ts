/**
 * Enum for how the robot is at the end of the match, whether it is parked, climbed, or neither.
 */
enum ClimbResult {
    None = 0,
    Parked = 1,
    Shallow = 2,
    Deep = 3,
}

export default ClimbResult;