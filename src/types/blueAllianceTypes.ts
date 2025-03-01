/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BlueAllianceAPIStatus {
  /** Year of the current FRC season. */
  current_season: number;
  /** Maximum FRC season year for valid queries. */
  max_season: number;
  /** True if the entire FMS API provided by FIRST is down. */
  is_datafeed_down: boolean;
  /** An array of strings containing event keys of any active events that are no longer updating. */
  down_events: string[];
  ios: BlueAllianceAPIStatusAppVersion;
  android: BlueAllianceAPIStatusAppVersion;
}

export interface BlueAllianceAPIStatusAppVersion {
  /** Internal use - Minimum application version required to correctly connect and process data. */
  min_app_version: number;
  /** Internal use - Latest application version available. */
  latest_app_version: number;
}

export interface BlueAllianceTeamSimple {
  /** TBA team key with the format `frcXXXX` with `XXXX` representing the team number. */
  key: string;
  /** Official team number issued by FIRST. */
  team_number: number;
  /** Team nickname provided by FIRST. */
  nickname: string;
  /** Official long name registered with FIRST. */
  name: string;
  /** City of team derived from parsing the address registered with FIRST. */
  city: string | null;
  /** State of team derived from parsing the address registered with FIRST. */
  state_prov: string | null;
  /** Country of team derived from parsing the address registered with FIRST. */
  country: string | null;
}

export interface BlueAllianceTeam {
  /** TBA team key with the format `frcXXXX` with `XXXX` representing the team number. */
  key: string;
  /** Official team number issued by FIRST. */
  team_number: number;
  /** Team nickname provided by FIRST. */
  nickname: string;
  /** Official long name registered with FIRST. */
  name: string;
  /** Name of team school or affilited group registered with FIRST. */
  school_name: string | null;
  /** City of team derived from parsing the address registered with FIRST. */
  city: string | null;
  /** State of team derived from parsing the address registered with FIRST. */
  state_prov: string | null;
  /** Country of team derived from parsing the address registered with FIRST. */
  country: string | null;
  /** Will be NULL, for future development. */
  address: string | null;
  /** Postal code from the team address. */
  postal_code: string | null;
  /** Will be NULL, for future development. */
  gmaps_place_id: string | null;
  /**
   * Will be NULL, for future development.
   * @format url
   */
  gmaps_url: string | null;
  /**
   * Will be NULL, for future development.
   * @format double
   */
  lat: number | null;
  /**
   * Will be NULL, for future development.
   * @format double
   */
  lng: number | null;
  /** Will be NULL, for future development. */
  location_name: string | null;
  /**
   * Official website associated with the team.
   * @format url
   */
  website?: string | null;
  /** First year the team officially competed. */
  rookie_year: number | null;
}

export interface BlueAllianceTeamRobot {
  /** Year this robot competed in. */
  year: number;
  /** Name of the robot as provided by the team. */
  robot_name: string;
  /** Internal TBA identifier for this robot. */
  key: string;
  /** TBA team key for this robot. */
  team_key: string;
}

export interface BlueAllianceEventSimple {
  /** TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event. */
  key: string;
  /** Official name of event on record either provided by FIRST or organizers of offseason event. */
  name: string;
  /** Event short code, as provided by FIRST. */
  event_code: string;
  /** Event Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/event_type.py#L2 */
  event_type: number;
  district: BlueAllianceDistrictList | null;
  /** City, town, village, etc. the event is located in. */
  city: string | null;
  /** State or Province the event is located in. */
  state_prov: string | null;
  /** Country the event is located in. */
  country: string | null;
  /**
   * Event start date in `yyyy-mm-dd` format.
   * @format date
   */
  start_date: string;
  /**
   * Event end date in `yyyy-mm-dd` format.
   * @format date
   */
  end_date: string;
  /** Year the event data is for. */
  year: number;
}

export interface BlueAllianceEvent {
  /** TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event. */
  key: string;
  /** Official name of event on record either provided by FIRST or organizers of offseason event. */
  name: string;
  /** Event short code, as provided by FIRST. */
  event_code: string;
  /** Event Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/event_type.py#L2 */
  event_type: number;
  district: BlueAllianceDistrictList | null;
  /** City, town, village, etc. the event is located in. */
  city: string | null;
  /** State or Province the event is located in. */
  state_prov: string | null;
  /** Country the event is located in. */
  country: string | null;
  /**
   * Event start date in `yyyy-mm-dd` format.
   * @format date
   */
  start_date: string;
  /**
   * Event end date in `yyyy-mm-dd` format.
   * @format date
   */
  end_date: string;
  /** Year the event data is for. */
  year: number;
  /** Same as `name` but doesn't include event specifiers, such as 'Regional' or 'District'. May be null. */
  short_name: string | null;
  /** Event Type, eg Regional, District, or Offseason. */
  event_type_string: string;
  /** Week of the event relative to the first official season event, zero-indexed. Only valid for Regionals, Districts, and District Championships. Null otherwise. (Eg. A season with a week 0 'preseason' event does not count, and week 1 events will show 0 here. Seasons with a week 0.5 regional event will show week 0 for those event(s) and week 1 for week 1 events and so on.) */
  week: number | null;
  /** Address of the event's venue, if available. */
  address: string | null;
  /** Postal code from the event address. */
  postal_code: string | null;
  /** Google Maps Place ID for the event address. */
  gmaps_place_id: string | null;
  /**
   * Link to address location on Google Maps.
   * @format url
   */
  gmaps_url: string | null;
  /**
   * Latitude for the event address.
   * @format double
   */
  lat: number | null;
  /**
   * Longitude for the event address.
   * @format double
   */
  lng: number | null;
  /** Name of the location at the address for the event, eg. Blue Alliance High School. */
  location_name: string | null;
  /** Timezone name. */
  timezone: string;
  /** The event's website, if any. */
  website: string | null;
  /** The FIRST internal Event ID, used to link to the event on the FRC webpage. */
  first_event_id: string | null;
  /** Public facing event code used by FIRST (on frc-events.firstinspires.org, for example) */
  first_event_code: string | null;
  webcasts: BlueAllianceWebcast[];
  /** An array of event keys for the divisions at this event. */
  division_keys: string[];
  /** The TBA Event key that represents the event's parent. Used to link back to the event from a division event. It is also the inverse relation of `divison_keys`. */
  parent_event_key: string | null;
  /** Playoff Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/playoff_type.py#L4, or null. */
  playoff_type: number | null;
  /** String representation of the `playoff_type`, or null. */
  playoff_type_string: string | null;
}

export interface BlueAllianceTeamEventStatus {
  qual?: BlueAllianceTeamEventStatusRank | null;
  alliance?: BlueAllianceTeamEventStatusAlliance | null;
  playoff?: BlueAllianceTeamEventStatusPlayoff | null;
  /** An HTML formatted string suitable for display to the user containing the team's alliance pick status. */
  alliance_status_str?: string;
  /** An HTML formatter string suitable for display to the user containing the team's playoff status. */
  playoff_status_str?: string;
  /** An HTML formatted string suitable for display to the user containing the team's overall status summary of the event. */
  overall_status_str?: string;
  /** TBA match key for the next match the team is scheduled to play in at this event, or null. */
  next_match_key?: string | null;
  /** TBA match key for the last match the team played in at this event, or null. */
  last_match_key?: string | null;
}

export interface BlueAllianceTeamEventStatusRank {
  /** Number of teams ranked. */
  num_teams?: number;
  ranking?: {
    /** Number of matches played. */
    matches_played?: number;
    /**
     * For some years, average qualification score. Can be null.
     * @format double
     */
    qual_average?: number;
    /** Ordered list of values used to determine the rank. See the `sort_order_info` property for the name of each value. */
    sort_orders?: number[];
    record?: BlueAllianceWLTRecord | null;
    /** Relative rank of this team. */
    rank?: number;
    /** Number of matches the team was disqualified for. */
    dq?: number;
    /** TBA team key for this rank. */
    team_key?: string;
  };
  /** Ordered list of names corresponding to the elements of the `sort_orders` array. */
  sort_order_info?: {
    /** The number of digits of precision used for this value, eg `2` would correspond to a value of `101.11` while `0` would correspond to `101`. */
    precision?: number;
    /** The descriptive name of the value used to sort the ranking. */
    name?: string;
  }[];
  status?: string;
}

export interface BlueAllianceTeamEventStatusAlliance {
  /** Alliance name, may be null. */
  name?: string | null;
  /** Alliance number. */
  number: number;
  /** Backup status, may be null. */
  backup?: BlueAllianceTeamEventStatusAllianceBackup;
  /** Order the team was picked in the alliance from 0-2, with 0 being alliance captain. */
  pick: number;
}

/** Backup status, may be null. */
export type BlueAllianceTeamEventStatusAllianceBackup = {
  /** TBA key for the team replaced by the backup. */
  out?: string;
  /** TBA key for the backup team called in. */
  in?: string;
} | null;

/** Playoff status for this team, may be null if the team did not make playoffs, or playoffs have not begun. */
export type BlueAllianceTeamEventStatusPlayoff = {
  /** The highest playoff level the team reached. */
  level?: "qm" | "ef" | "qf" | "sf" | "f";
  current_level_record?: BlueAllianceWLTRecord | null;
  record?: BlueAllianceWLTRecord | null;
  /** Current competition status for the playoffs. */
  status?: "won" | "eliminated" | "playing";
  /**
   * The average match score during playoffs. Year specific. May be null if not relevant for a given year.
   * @format double
   */
  playoff_average?: number | null;
};

export interface BlueAllianceEventRanking {
  /** List of rankings at the event. */
  rankings: {
    /** Number of matches played by this team. */
    matches_played: number;
    /** The average match score during qualifications. Year specific. May be null if not relevant for a given year. */
    qual_average: number | null;
    /** Additional special data on the team's performance calculated by TBA. */
    extra_stats: number[];
    /** Additional year-specific information, may be null. See parent `sort_order_info` for details. */
    sort_orders: number[] | null;
    record: BlueAllianceWLTRecord | null;
    /** The team's rank at the event as provided by FIRST. */
    rank: number;
    /** Number of times disqualified. */
    dq: number;
    /** The team with this rank. */
    team_key: string;
  }[];
  /** List of special TBA-generated values provided in the `extra_stats` array for each item. */
  extra_stats_info: {
    /** Integer expressing the number of digits of precision in the number provided in `sort_orders`. */
    precision: number;
    /** Name of the field used in the `extra_stats` array. */
    name: string;
  }[];
  /** List of year-specific values provided in the `sort_orders` array for each team. */
  sort_order_info: {
    /** Integer expressing the number of digits of precision in the number provided in `sort_orders`. */
    precision: number;
    /** Name of the field used in the `sort_order` array. */
    name: string;
  }[];
}

export interface BlueAllianceEventDistrictPoints {
  /** Points gained for each team at the event. Stored as a key-value pair with the team key as the key, and an object describing the points as its value. */
  points: Record<
    string,
    {
      /** Total points awarded at this event. */
      total: number;
      /** Points awarded for alliance selection */
      alliance_points: number;
      /** Points awarded for elimination match performance. */
      elim_points: number;
      /** Points awarded for event awards. */
      award_points: number;
      /** Points awarded for qualification match performance. */
      qual_points: number;
    }
  >;
  /** Tiebreaker values for each team at the event. Stored as a key-value pair with the team key as the key, and an object describing the tiebreaker elements as its value. */
  tiebreakers?: Record<
    string,
    {
      highest_qual_scores?: number[];
      qual_wins?: number;
    }
  >;
}

/** A year-specific event insight object expressed as a JSON string, separated in to `qual` and `playoff` fields. See also Event_Insights_2016, Event_Insights_2017, etc. */
export interface BlueAllianceEventInsights {
  /** Inights for the qualification round of an event */
  qual?: object;
  /** Insights for the playoff round of an event */
  playoff?: object;
}

/** Insights for FIRST Stronghold qualification and elimination matches. */
export interface BlueAllianceEventInsights2016 {
  /** For the Low Bar - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  LowBar: number[];
  /** For the Cheval De Frise - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  A_ChevalDeFrise: number[];
  /** For the Portcullis - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  A_Portcullis: number[];
  /** For the Ramparts - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  B_Ramparts: number[];
  /** For the Moat - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  B_Moat: number[];
  /** For the Sally Port - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  C_SallyPort: number[];
  /** For the Drawbridge - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  C_Drawbridge: number[];
  /** For the Rough Terrain - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  D_RoughTerrain: number[];
  /** For the Rock Wall - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
  D_RockWall: number[];
  /**
   * Average number of high goals scored.
   * @format float
   */
  average_high_goals: number;
  /**
   * Average number of low goals scored.
   * @format float
   */
  average_low_goals: number;
  /** An array with three values, number of times breached, number of opportunities to breach, and percentage. */
  breaches: number[];
  /** An array with three values, number of times scaled, number of opportunities to scale, and percentage. */
  scales: number[];
  /** An array with three values, number of times challenged, number of opportunities to challenge, and percentage. */
  challenges: number[];
  /** An array with three values, number of times captured, number of opportunities to capture, and percentage. */
  captures: number[];
  /**
   * Average winning score.
   * @format float
   */
  average_win_score: number;
  /**
   * Average margin of victory.
   * @format float
   */
  average_win_margin: number;
  /**
   * Average total score.
   * @format float
   */
  average_score: number;
  /**
   * Average autonomous score.
   * @format float
   */
  average_auto_score: number;
  /**
   * Average crossing score.
   * @format float
   */
  average_crossing_score: number;
  /**
   * Average boulder score.
   * @format float
   */
  average_boulder_score: number;
  /**
   * Average tower score.
   * @format float
   */
  average_tower_score: number;
  /**
   * Average foul score.
   * @format float
   */
  average_foul_score: number;
  /** An array with three values, high score, match key from the match with the high score, and the name of the match. */
  high_score: string[];
}

/** Insights for FIRST STEAMWORKS qualification and elimination matches. */
export interface BlueAllianceEventInsights2017 {
  /**
   * Average foul score.
   * @format float
   */
  average_foul_score: number;
  /**
   * Average fuel points scored.
   * @format float
   */
  average_fuel_points: number;
  /**
   * Average fuel points scored during auto.
   * @format float
   */
  average_fuel_points_auto: number;
  /**
   * Average fuel points scored during teleop.
   * @format float
   */
  average_fuel_points_teleop: number;
  /**
   * Average points scored in the high goal.
   * @format float
   */
  average_high_goals: number;
  /**
   * Average points scored in the high goal during auto.
   * @format float
   */
  average_high_goals_auto: number;
  /**
   * Average points scored in the high goal during teleop.
   * @format float
   */
  average_high_goals_teleop: number;
  /**
   * Average points scored in the low goal.
   * @format float
   */
  average_low_goals: number;
  /**
   * Average points scored in the low goal during auto.
   * @format float
   */
  average_low_goals_auto: number;
  /**
   * Average points scored in the low goal during teleop.
   * @format float
   */
  average_low_goals_teleop: number;
  /**
   * Average mobility points scored during auto.
   * @format float
   */
  average_mobility_points_auto: number;
  /**
   * Average points scored during auto.
   * @format float
   */
  average_points_auto: number;
  /**
   * Average points scored during teleop.
   * @format float
   */
  average_points_teleop: number;
  /**
   * Average rotor points scored.
   * @format float
   */
  average_rotor_points: number;
  /**
   * Average rotor points scored during auto.
   * @format float
   */
  average_rotor_points_auto: number;
  /**
   * Average rotor points scored during teleop.
   * @format float
   */
  average_rotor_points_teleop: number;
  /**
   * Average score.
   * @format float
   */
  average_score: number;
  /**
   * Average takeoff points scored during teleop.
   * @format float
   */
  average_takeoff_points_teleop: number;
  /**
   * Average margin of victory.
   * @format float
   */
  average_win_margin: number;
  /**
   * Average winning score.
   * @format float
   */
  average_win_score: number;
  /** An array with three values, kPa scored, match key from the match with the high kPa, and the name of the match */
  high_kpa: string[];
  /** An array with three values, high score, match key from the match with the high score, and the name of the match */
  high_score: string[];
  /** An array with three values, number of times kPa bonus achieved, number of opportunities to bonus, and percentage. */
  kpa_achieved: number[];
  /** An array with three values, number of times mobility bonus achieved, number of opportunities to bonus, and percentage. */
  mobility_counts: number[];
  /** An array with three values, number of times rotor 1 engaged, number of opportunities to engage, and percentage. */
  rotor_1_engaged: number[];
  /** An array with three values, number of times rotor 1 engaged in auto, number of opportunities to engage in auto, and percentage. */
  rotor_1_engaged_auto: number[];
  /** An array with three values, number of times rotor 2 engaged, number of opportunities to engage, and percentage. */
  rotor_2_engaged: number[];
  /** An array with three values, number of times rotor 2 engaged in auto, number of opportunities to engage in auto, and percentage. */
  rotor_2_engaged_auto: number[];
  /** An array with three values, number of times rotor 3 engaged, number of opportunities to engage, and percentage. */
  rotor_3_engaged: number[];
  /** An array with three values, number of times rotor 4 engaged, number of opportunities to engage, and percentage. */
  rotor_4_engaged: number[];
  /** An array with three values, number of times takeoff was counted, number of opportunities to takeoff, and percentage. */
  takeoff_counts: number[];
  /** An array with three values, number of times a unicorn match (Win + kPa & Rotor Bonuses) occured, number of opportunities to have a unicorn match, and percentage. */
  unicorn_matches: number[];
}

/** Insights for FIRST Power Up qualification and elimination matches. */
export interface BlueAllianceEventInsights2018 {
  /** An array with three values, number of times auto quest was completed, number of opportunities to complete the auto quest, and percentage. */
  auto_quest_achieved: number[];
  /**
   * Average number of boost power up scored (out of 3).
   * @format float
   */
  average_boost_played: number;
  /**
   * Average endgame points.
   * @format float
   */
  average_endgame_points: number;
  /**
   * Average number of force power up scored (out of 3).
   * @format float
   */
  average_force_played: number;
  /**
   * Average foul score.
   * @format float
   */
  average_foul_score: number;
  /**
   * Average points scored during auto.
   * @format float
   */
  average_points_auto: number;
  /**
   * Average points scored during teleop.
   * @format float
   */
  average_points_teleop: number;
  /**
   * Average mobility points scored during auto.
   * @format float
   */
  average_run_points_auto: number;
  /**
   * Average scale ownership points scored.
   * @format float
   */
  average_scale_ownership_points: number;
  /**
   * Average scale ownership points scored during auto.
   * @format float
   */
  average_scale_ownership_points_auto: number;
  /**
   * Average scale ownership points scored during teleop.
   * @format float
   */
  average_scale_ownership_points_teleop: number;
  /**
   * Average score.
   * @format float
   */
  average_score: number;
  /**
   * Average switch ownership points scored.
   * @format float
   */
  average_switch_ownership_points: number;
  /**
   * Average switch ownership points scored during auto.
   * @format float
   */
  average_switch_ownership_points_auto: number;
  /**
   * Average switch ownership points scored during teleop.
   * @format float
   */
  average_switch_ownership_points_teleop: number;
  /**
   * Average value points scored.
   * @format float
   */
  average_vault_points: number;
  /**
   * Average margin of victory.
   * @format float
   */
  average_win_margin: number;
  /**
   * Average winning score.
   * @format float
   */
  average_win_score: number;
  /** An array with three values, number of times a boost power up was played, number of opportunities to play a boost power up, and percentage. */
  boost_played_counts: number[];
  /** An array with three values, number of times a climb occurred, number of opportunities to climb, and percentage. */
  climb_counts: number[];
  /** An array with three values, number of times an alliance faced the boss, number of opportunities to face the boss, and percentage. */
  face_the_boss_achieved: number[];
  /** An array with three values, number of times a force power up was played, number of opportunities to play a force power up, and percentage. */
  force_played_counts: number[];
  /** An array with three values, high score, match key from the match with the high score, and the name of the match */
  high_score: string[];
  /** An array with three values, number of times a levitate power up was played, number of opportunities to play a levitate power up, and percentage. */
  levitate_played_counts: number[];
  /** An array with three values, number of times a team scored mobility points in auto, number of opportunities to score mobility points in auto, and percentage. */
  run_counts_auto: number[];
  /**
   * Average scale neutral percentage.
   * @format float
   */
  scale_neutral_percentage: number;
  /**
   * Average scale neutral percentage during auto.
   * @format float
   */
  scale_neutral_percentage_auto: number;
  /**
   * Average scale neutral percentage during teleop.
   * @format float
   */
  scale_neutral_percentage_teleop: number;
  /** An array with three values, number of times a switch was owned during auto, number of opportunities to own a switch during auto, and percentage. */
  switch_owned_counts_auto: number[];
  /** An array with three values, number of times a unicorn match (Win + Auto Quest + Face the Boss) occurred, number of opportunities to have a unicorn match, and percentage. */
  unicorn_matches: number[];
  /**
   * Average opposing switch denail percentage for the winning alliance during teleop.
   * @format float
   */
  winning_opp_switch_denial_percentage_teleop: number;
  /**
   * Average own switch ownership percentage for the winning alliance.
   * @format float
   */
  winning_own_switch_ownership_percentage: number;
  /**
   * Average own switch ownership percentage for the winning alliance during auto.
   * @format float
   */
  winning_own_switch_ownership_percentage_auto: number;
  /**
   * Average own switch ownership percentage for the winning alliance during teleop.
   * @format float
   */
  winning_own_switch_ownership_percentage_teleop: number;
  /**
   * Average scale ownership percentage for the winning alliance.
   * @format float
   */
  winning_scale_ownership_percentage: number;
  /**
   * Average scale ownership percentage for the winning alliance during auto.
   * @format float
   */
  winning_scale_ownership_percentage_auto: number;
  /**
   * Average scale ownership percentage for the winning alliance during teleop.
   * @format float
   */
  winning_scale_ownership_percentage_teleop: number;
}

/** OPR, DPR, and CCWM for teams at the event. */
export interface BlueAllianceEventOPRs {
  /** A key-value pair with team key (eg `frc254`) as key and OPR as value. */
  oprs?: Record<string, number>;
  /** A key-value pair with team key (eg `frc254`) as key and DPR as value. */
  dprs?: Record<string, number>;
  /** A key-value pair with team key (eg `frc254`) as key and CCWM as value. */
  ccwms?: Record<string, number>;
}

/** Component OPRs for teams at the event. */
export type BlueAllianceEventCOPRs = Record<string, Record<string, number>>;

/** JSON Object containing prediction information for the event. Contains year-specific information and is subject to change. */
export type BlueAllianceEventPredictions = object;

export interface BlueAllianceMatchSimple {
  /** TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may append the competition level if more than one match in required per set. */
  key: string;
  /** The competition level the match was played at. */
  comp_level: "qm" | "ef" | "qf" | "sf" | "f";
  /** The set number in a series of matches where more than one match is required in the match series. */
  set_number: number;
  /** The match number of the match in the competition level. */
  match_number: number;
  /** A list of alliances, the teams on the alliances, and their score. */
  alliances: {
    red: BlueAllianceMatchAlliance;
    blue: BlueAllianceMatchAlliance;
  };
  /** The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie. */
  winning_alliance: "red" | "blue" | "";
  /** Event key of the event the match was played at. */
  event_key: string;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match time, as taken from the published schedule.
   * @format int64
   */
  time: number | null;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted match start time.
   * @format int64
   */
  predicted_time: number | null;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start time.
   * @format int64
   */
  actual_time: number | null;
}

export interface BlueAllianceMatch {
  /** TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may be appended to the competition level if more than one match in required per set. */
  key: string;
  /** The competition level the match was played at. */
  comp_level: "qm" | "ef" | "qf" | "sf" | "f";
  /** The set number in a series of matches where more than one match is required in the match series. */
  set_number: number;
  /** The match number of the match in the competition level. */
  match_number: number;
  /** A list of alliances, the teams on the alliances, and their score. */
  alliances: {
    red: BlueAllianceMatchAlliance;
    blue: BlueAllianceMatchAlliance;
  };
  /** The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie. */
  winning_alliance: "red" | "blue" | "";
  /** Event key of the event the match was played at. */
  event_key: string;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match time, as taken from the published schedule.
   * @format int64
   */
  time: number | null;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start time.
   * @format int64
   */
  actual_time: number | null;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted match start time.
   * @format int64
   */
  predicted_time: number | null;
  /**
   * UNIX timestamp (seconds since 1-Jan-1970 00:00:00) when the match result was posted.
   * @format int64
   */
  post_result_time: number | null;
  /** Score breakdown for auto, teleop, etc. points. Varies from year to year. May be null. */
  score_breakdown:
    | BlueAllianceMatchScoreBreakdown2015
    | BlueAllianceMatchScoreBreakdown2016
    | BlueAllianceMatchScoreBreakdown2017
    | BlueAllianceMatchScoreBreakdown2018
    | BlueAllianceMatchScoreBreakdown2019
    | BlueAllianceMatchScoreBreakdown2020
    | BlueAllianceMatchScoreBreakdown2022
    | BlueAllianceMatchScoreBreakdown2023
    | BlueAllianceMatchScoreBreakdown2024
    | BlueAllianceMatchScoreBreakdown2025
    | null;
  /** Array of video objects associated with this match. */
  videos: {
    /** Can be one of 'youtube' or 'tba' */
    type: string;
    /** Unique key representing this video */
    key: string;
  }[];
}

export interface BlueAllianceMatchAlliance {
  /** Score for this alliance. Will be null or -1 for an unplayed match. */
  score: number;
  team_keys: string[];
  /** TBA team keys (eg `frc254`) of any teams playing as a surrogate. */
  surrogate_team_keys: string[];
  /** TBA team keys (eg `frc254`) of any disqualified teams. */
  dq_team_keys: string[];
}

export interface BlueAllianceZebra {
  /** TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may be appended to the competition level if more than one match in required per set. */
  key: string;
  /** A list of relative timestamps for each data point. Each timestamp will correspond to the X and Y value at the same index in a team xs and ys arrays. `times`, all teams `xs` and all teams `ys` are guarenteed to be the same length. */
  times: number[];
  alliances: {
    /** Zebra MotionWorks data for teams on the red alliance */
    red?: BlueAllianceZebraTeam[];
    /** Zebra data for teams on the blue alliance */
    blue?: BlueAllianceZebraTeam[];
  };
}

export interface BlueAllianceZebraTeam {
  /**
   * The TBA team key for the Zebra MotionWorks data.
   * @example "frc7332"
   */
  team_key: string;
  /** A list containing doubles and nulls representing a teams X position in feet at the corresponding timestamp. A null value represents no tracking data for a given timestamp. */
  xs: number[];
  /** A list containing doubles and nulls representing a teams Y position in feet at the corresponding timestamp. A null value represents no tracking data for a given timestamp. */
  ys: number[];
}

/** See the 2015 FMS API documentation for a description of each value */
export interface BlueAllianceMatchScoreBreakdown2015 {
  blue: BlueAllianceMatchScoreBreakdown2015Alliance;
  red: BlueAllianceMatchScoreBreakdown2015Alliance;
  coopertition: "None" | "Unknown" | "Stack";
  coopertition_points: number;
}

export interface BlueAllianceMatchScoreBreakdown2015Alliance {
  auto_points?: number;
  teleop_points?: number;
  container_points?: number;
  tote_points?: number;
  litter_points?: number;
  foul_points?: number;
  adjust_points?: number;
  total_points?: number;
  foul_count?: number;
  tote_count_far?: number;
  tote_count_near?: number;
  tote_set?: boolean;
  tote_stack?: boolean;
  container_count_level1?: number;
  container_count_level2?: number;
  container_count_level3?: number;
  container_count_level4?: number;
  container_count_level5?: number;
  container_count_level6?: number;
  container_set?: boolean;
  litter_count_container?: number;
  litter_count_landfill?: number;
  litter_count_unprocessed?: number;
  robot_set?: boolean;
}

/** See the 2016 FMS API documentation for a description of each value. */
export interface BlueAllianceMatchScoreBreakdown2016 {
  blue: BlueAllianceMatchScoreBreakdown2016Alliance;
  red: BlueAllianceMatchScoreBreakdown2016Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2016Alliance {
  autoPoints?: number;
  teleopPoints?: number;
  breachPoints?: number;
  foulPoints?: number;
  capturePoints?: number;
  adjustPoints?: number;
  totalPoints?: number;
  robot1Auto?: "Crossed" | "Reached" | "None";
  robot2Auto?: "Crossed" | "Reached" | "None";
  robot3Auto?: "Crossed" | "Reached" | "None";
  autoReachPoints?: number;
  autoCrossingPoints?: number;
  autoBouldersLow?: number;
  autoBouldersHigh?: number;
  autoBoulderPoints?: number;
  teleopCrossingPoints?: number;
  teleopBouldersLow?: number;
  teleopBouldersHigh?: number;
  teleopBoulderPoints?: number;
  teleopDefensesBreached?: boolean;
  teleopChallengePoints?: number;
  teleopScalePoints?: number;
  teleopTowerCaptured?: boolean;
  towerFaceA?: string;
  towerFaceB?: string;
  towerFaceC?: string;
  towerEndStrength?: number;
  techFoulCount?: number;
  foulCount?: number;
  position2?: string;
  position3?: string;
  position4?: string;
  position5?: string;
  position1crossings?: number;
  position2crossings?: number;
  position3crossings?: number;
  position4crossings?: number;
  position5crossings?: number;
}

/** See the 2017 FMS API documentation for a description of each value. */
export interface BlueAllianceMatchScoreBreakdown2017 {
  blue: BlueAllianceMatchScoreBreakdown2017Alliance;
  red: BlueAllianceMatchScoreBreakdown2017Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2017Alliance {
  autoPoints?: number;
  teleopPoints?: number;
  foulPoints?: number;
  adjustPoints?: number;
  totalPoints?: number;
  robot1Auto?: "Unknown" | "Mobility" | "None";
  robot2Auto?: "Unknown" | "Mobility" | "None";
  robot3Auto?: "Unknown" | "Mobility" | "None";
  rotor1Auto?: boolean;
  rotor2Auto?: boolean;
  autoFuelLow?: number;
  autoFuelHigh?: number;
  autoMobilityPoints?: number;
  autoRotorPoints?: number;
  autoFuelPoints?: number;
  teleopFuelPoints?: number;
  teleopFuelLow?: number;
  teleopFuelHigh?: number;
  teleopRotorPoints?: number;
  kPaRankingPointAchieved?: boolean;
  teleopTakeoffPoints?: number;
  kPaBonusPoints?: number;
  rotorBonusPoints?: number;
  rotor1Engaged?: boolean;
  rotor2Engaged?: boolean;
  rotor3Engaged?: boolean;
  rotor4Engaged?: boolean;
  rotorRankingPointAchieved?: boolean;
  techFoulCount?: number;
  foulCount?: number;
  touchpadNear?: string;
  touchpadMiddle?: string;
  touchpadFar?: string;
}

/** See the 2018 FMS API documentation for a description of each value. https://frcevents2.docs.apiary.io/#/reference/match-results/score-details */
export interface BlueAllianceMatchScoreBreakdown2018 {
  blue: BlueAllianceMatchScoreBreakdown2018Alliance;
  red: BlueAllianceMatchScoreBreakdown2018Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2018Alliance {
  adjustPoints?: number;
  autoOwnershipPoints?: number;
  autoPoints?: number;
  autoQuestRankingPoint?: boolean;
  autoRobot1?: string;
  autoRobot2?: string;
  autoRobot3?: string;
  autoRunPoints?: number;
  autoScaleOwnershipSec?: number;
  autoSwitchAtZero?: boolean;
  autoSwitchOwnershipSec?: number;
  endgamePoints?: number;
  endgameRobot1?: string;
  endgameRobot2?: string;
  endgameRobot3?: string;
  faceTheBossRankingPoint?: boolean;
  foulCount?: number;
  foulPoints?: number;
  rp?: number;
  techFoulCount?: number;
  teleopOwnershipPoints?: number;
  teleopPoints?: number;
  teleopScaleBoostSec?: number;
  teleopScaleForceSec?: number;
  teleopScaleOwnershipSec?: number;
  teleopSwitchBoostSec?: number;
  teleopSwitchForceSec?: number;
  teleopSwitchOwnershipSec?: number;
  totalPoints?: number;
  vaultBoostPlayed?: number;
  vaultBoostTotal?: number;
  vaultForcePlayed?: number;
  vaultForceTotal?: number;
  vaultLevitatePlayed?: number;
  vaultLevitateTotal?: number;
  vaultPoints?: number;
  /** Unofficial TBA-computed value of the FMS provided GameData given to the alliance teams at the start of the match. 3 Character String containing `L` and `R` only. The first character represents the near switch, the 2nd the scale, and the 3rd the far, opposing, switch from the alliance's perspective. An `L` in a position indicates the platform on the left will be lit for the alliance while an `R` will indicate the right platform will be lit for the alliance. See also [WPI Screen Steps](https://wpilib.screenstepslive.com/s/currentCS/m/getting_started/l/826278-2018-game-data-details). */
  tba_gameData?: string;
}

/**
 * Timeseries data for the 2018 game *FIRST* POWER UP.
 * *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
 * *WARNING:* This model is currently under active development and may change at any time, including in breaking ways.
 */
export interface BlueAllianceMatchTimeseries2018 {
  /** TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event. */
  event_key?: string;
  /** Match ID consisting of the level, match number, and set number, eg `qm45` or `f1m1`. */
  match_id?: string;
  /** Current mode of play, can be `pre_match`, `auto`, `telop`, or `post_match`. */
  mode?: string;
  play?: number;
  /** Amount of time remaining in the match, only valid during `auto` and `teleop` modes. */
  time_remaining?: number;
  /** 1 if the blue alliance is credited with the AUTO QUEST, 0 if not. */
  blue_auto_quest?: number;
  /** Number of POWER CUBES in the BOOST section of the blue alliance VAULT. */
  blue_boost_count?: number;
  /** Returns 1 if the blue alliance BOOST was played, or 0 if not played. */
  blue_boost_played?: number;
  /** Name of the current blue alliance POWER UP being played, or `null`. */
  blue_current_powerup?: string;
  /** 1 if the blue alliance is credited with FACING THE BOSS, 0 if not. */
  blue_face_the_boss?: number;
  /** Number of POWER CUBES in the FORCE section of the blue alliance VAULT. */
  blue_force_count?: number;
  /** Returns 1 if the blue alliance FORCE was played, or 0 if not played. */
  blue_force_played?: number;
  /** Number of POWER CUBES in the LEVITATE section of the blue alliance VAULT. */
  blue_levitate_count?: number;
  /** Returns 1 if the blue alliance LEVITATE was played, or 0 if not played. */
  blue_levitate_played?: number;
  /** Number of seconds remaining in the blue alliance POWER UP time, or 0 if none is active. */
  blue_powerup_time_remaining?: string;
  /** 1 if the blue alliance owns the SCALE, 0 if not. */
  blue_scale_owned?: number;
  /** Current score for the blue alliance. */
  blue_score?: number;
  /** 1 if the blue alliance owns their SWITCH, 0 if not. */
  blue_switch_owned?: number;
  /** 1 if the red alliance is credited with the AUTO QUEST, 0 if not. */
  red_auto_quest?: number;
  /** Number of POWER CUBES in the BOOST section of the red alliance VAULT. */
  red_boost_count?: number;
  /** Returns 1 if the red alliance BOOST was played, or 0 if not played. */
  red_boost_played?: number;
  /** Name of the current red alliance POWER UP being played, or `null`. */
  red_current_powerup?: string;
  /** 1 if the red alliance is credited with FACING THE BOSS, 0 if not. */
  red_face_the_boss?: number;
  /** Number of POWER CUBES in the FORCE section of the red alliance VAULT. */
  red_force_count?: number;
  /** Returns 1 if the red alliance FORCE was played, or 0 if not played. */
  red_force_played?: number;
  /** Number of POWER CUBES in the LEVITATE section of the red alliance VAULT. */
  red_levitate_count?: number;
  /** Returns 1 if the red alliance LEVITATE was played, or 0 if not played. */
  red_levitate_played?: number;
  /** Number of seconds remaining in the red alliance POWER UP time, or 0 if none is active. */
  red_powerup_time_remaining?: string;
  /** 1 if the red alliance owns the SCALE, 0 if not. */
  red_scale_owned?: number;
  /** Current score for the red alliance. */
  red_score?: number;
  /** 1 if the red alliance owns their SWITCH, 0 if not. */
  red_switch_owned?: number;
}

/** See the 2019 FMS API documentation for a description of each value. https://frcevents2.docs.apiary.io/#/reference/match-results/score-details */
export interface BlueAllianceMatchScoreBreakdown2019 {
  blue: BlueAllianceMatchScoreBreakdown2019Alliance;
  red: BlueAllianceMatchScoreBreakdown2019Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2019Alliance {
  adjustPoints?: number;
  autoPoints?: number;
  bay1?: string;
  bay2?: string;
  bay3?: string;
  bay4?: string;
  bay5?: string;
  bay6?: string;
  bay7?: string;
  bay8?: string;
  cargoPoints?: number;
  completeRocketRankingPoint?: boolean;
  completedRocketFar?: boolean;
  completedRocketNear?: boolean;
  endgameRobot1?: string;
  endgameRobot2?: string;
  endgameRobot3?: string;
  foulCount?: number;
  foulPoints?: number;
  habClimbPoints?: number;
  habDockingRankingPoint?: boolean;
  habLineRobot1?: string;
  habLineRobot2?: string;
  habLineRobot3?: string;
  hatchPanelPoints?: number;
  lowLeftRocketFar?: string;
  lowLeftRocketNear?: string;
  lowRightRocketFar?: string;
  lowRightRocketNear?: string;
  midLeftRocketFar?: string;
  midLeftRocketNear?: string;
  midRightRocketFar?: string;
  midRightRocketNear?: string;
  preMatchBay1?: string;
  preMatchBay2?: string;
  preMatchBay3?: string;
  preMatchBay6?: string;
  preMatchBay7?: string;
  preMatchBay8?: string;
  preMatchLevelRobot1?: string;
  preMatchLevelRobot2?: string;
  preMatchLevelRobot3?: string;
  rp?: number;
  sandStormBonusPoints?: number;
  techFoulCount?: number;
  teleopPoints?: number;
  topLeftRocketFar?: string;
  topLeftRocketNear?: string;
  topRightRocketFar?: string;
  topRightRocketNear?: string;
  totalPoints?: number;
}

/** See the 2020 FMS API documentation for a description of each value. https://frcevents2.docs.apiary.io/#/reference/match-results/score-details */
export interface BlueAllianceMatchScoreBreakdown2020 {
  blue: BlueAllianceMatchScoreBreakdown2020Alliance;
  red: BlueAllianceMatchScoreBreakdown2020Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2020Alliance {
  initLineRobot1?: string;
  endgameRobot1?: string;
  initLineRobot2?: string;
  endgameRobot2?: string;
  initLineRobot3?: string;
  endgameRobot3?: string;
  autoCellsBottom?: number;
  autoCellsOuter?: number;
  autoCellsInner?: number;
  teleopCellsBottom?: number;
  teleopCellsOuter?: number;
  teleopCellsInner?: number;
  stage1Activated?: boolean;
  stage2Activated?: boolean;
  stage3Activated?: boolean;
  stage3TargetColor?: string;
  endgameRungIsLevel?: string;
  autoInitLinePoints?: number;
  autoCellPoints?: number;
  autoPoints?: number;
  teleopCellPoints?: number;
  controlPanelPoints?: number;
  endgamePoints?: number;
  teleopPoints?: number;
  shieldOperationalRankingPoint?: boolean;
  shieldEnergizedRankingPoint?: boolean;
  /** Unofficial TBA-computed value that indicates whether the shieldEnergizedRankingPoint was earned normally or awarded due to a foul. */
  tba_shieldEnergizedRankingPointFromFoul?: boolean;
  /** Unofficial TBA-computed value that counts the number of robots who were hanging at the end of the match. */
  tba_numRobotsHanging?: number;
  foulCount?: number;
  techFoulCount?: number;
  adjustPoints?: number;
  foulPoints?: number;
  rp?: number;
  totalPoints?: number;
}

/** See the 2022 FMS API documentation for a description of each value. https://frc-api-docs.firstinspires.org */
export interface BlueAllianceMatchScoreBreakdown2022 {
  blue: BlueAllianceMatchScoreBreakdown2022Alliance;
  red: BlueAllianceMatchScoreBreakdown2022Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2022Alliance {
  taxiRobot1?: "Yes" | "No";
  endgameRobot1?: "Traversal" | "High" | "Mid" | "Low" | "None";
  taxiRobot2?: "Yes" | "No";
  endgameRobot2?: "Traversal" | "High" | "Mid" | "Low" | "None";
  taxiRobot3?: "Yes" | "No";
  endgameRobot3?: "Traversal" | "High" | "Mid" | "Low" | "None";
  autoCargoLowerNear?: number;
  autoCargoLowerFar?: number;
  autoCargoLowerBlue?: number;
  autoCargoLowerRed?: number;
  autoCargoUpperNear?: number;
  autoCargoUpperFar?: number;
  autoCargoUpperBlue?: number;
  autoCargoUpperRed?: number;
  autoCargoTotal?: number;
  teleopCargoLowerNear?: number;
  teleopCargoLowerFar?: number;
  teleopCargoLowerBlue?: number;
  teleopCargoLowerRed?: number;
  teleopCargoUpperNear?: number;
  teleopCargoUpperFar?: number;
  teleopCargoUpperBlue?: number;
  teleopCargoUpperRed?: number;
  teleopCargoTotal?: number;
  matchCargoTotal?: number;
  autoTaxiPoints?: number;
  autoCargoPoints?: number;
  autoPoints?: number;
  quintetAchieved?: boolean;
  teleopCargoPoints?: number;
  endgamePoints?: number;
  teleopPoints?: number;
  cargoBonusRankingPoint?: boolean;
  hangarBonusRankingPoint?: boolean;
  foulCount?: number;
  techFoulCount?: number;
  adjustPoints?: number;
  foulPoints?: number;
  rp?: number;
  totalPoints?: number;
}

/** See the 2023 FMS API documentation for a description of each value. https://frc-api-docs.firstinspires.org */
export interface BlueAllianceMatchScoreBreakdown2023 {
  blue: BlueAllianceMatchScoreBreakdown2023Alliance;
  red: BlueAllianceMatchScoreBreakdown2023Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2023Alliance {
  activationBonusAchieved?: boolean;
  adjustPoints?: number;
  autoBridgeState?: "NotLevel" | "Level";
  autoChargeStationPoints?: number;
  autoChargeStationRobot1?: "None" | "Docked";
  autoChargeStationRobot2?: "None" | "Docked";
  autoChargeStationRobot3?: "None" | "Docked";
  autoDocked?: boolean;
  autoCommunity?: {
    B: ("None" | "Cone" | "Cube")[];
    M: ("None" | "Cone" | "Cube")[];
    T: ("None" | "Cone" | "Cube")[];
  };
  autoGamePieceCount?: number;
  autoGamePiecePoints?: number;
  autoMobilityPoints?: number;
  mobilityRobot1?: "Yes" | "No";
  mobilityRobot2?: "Yes" | "No";
  mobilityRobot3?: "Yes" | "No";
  autoPoints?: number;
  coopGamePieceCount?: number;
  coopertitionCriteriaMet?: boolean;
  endGameBridgeState?: "NotLevel" | "Level";
  endGameChargeStationPoints?: number;
  endGameChargeStationRobot1?: "None" | "Docked";
  endGameChargeStationRobot2?: "None" | "Docked";
  endGameChargeStationRobot3?: "None" | "Docked";
  endGameParkPoints?: number;
  extraGamePieceCount?: number;
  foulCount?: number;
  foulPoints?: number;
  techFoulCount?: number;
  linkPoints?: number;
  links?: {
    nodes: ("None" | "Cone" | "Cube")[];
    row: "Bottom" | "Mid" | "Top";
  }[];
  sustainabilityBonusAchieved?: boolean;
  teleopCommunity?: {
    B: ("None" | "Cone" | "Cube")[];
    M: ("None" | "Cone" | "Cube")[];
    T: ("None" | "Cone" | "Cube")[];
  };
  teleopGamePieceCount?: number;
  teleopGamePiecePoints?: number;
  totalChargeStationPoints?: number;
  teleopPoints?: number;
  rp?: number;
  totalPoints?: number;
}

/** See the 2024 FMS API documentation for a description of each value. https://frc-api-docs.firstinspires.org */
export interface BlueAllianceMatchScoreBreakdown2024 {
  blue: BlueAllianceMatchScoreBreakdown2024Alliance;
  red: BlueAllianceMatchScoreBreakdown2024Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2024Alliance {
  adjustPoints?: number;
  autoAmpNoteCount?: number;
  autoAmpNotePoints?: number;
  autoLeavePoints?: number;
  autoLineRobot1?: string;
  autoLineRobot2?: string;
  autoLineRobot3?: string;
  autoPoints?: number;
  autoSpeakerNoteCount?: number;
  autoSpeakerNotePoints?: number;
  autoTotalNotePoints?: number;
  coopNotePlayed?: boolean;
  coopertitionBonusAchieved?: boolean;
  coopertitionCriteriaMet?: boolean;
  endGameHarmonyPoints?: number;
  endGameNoteInTrapPoints?: number;
  endGameOnStagePoints?: number;
  endGameParkPoints?: number;
  endGameRobot1?: string;
  endGameRobot2?: string;
  endGameRobot3?: string;
  endGameSpotLightBonusPoints?: number;
  endGameTotalStagePoints?: number;
  ensembleBonusAchieved?: boolean;
  ensembleBonusOnStageRobotsThreshold?: number;
  ensembleBonusStagePointsThreshold?: number;
  foulCount?: number;
  foulPoints?: number;
  g206Penalty?: boolean;
  g408Penalty?: boolean;
  g424Penalty?: boolean;
  melodyBonusAchieved?: boolean;
  melodyBonusThreshold?: number;
  melodyBonusThresholdCoop?: number;
  melodyBonusThresholdNonCoop?: number;
  micCenterStage?: boolean;
  micStageLeft?: boolean;
  micStageRight?: boolean;
  rp?: number;
  techFoulCount?: number;
  teleopAmpNoteCount?: number;
  teleopAmpNotePoints?: number;
  teleopPoints?: number;
  teleopSpeakerNoteAmplifiedCount?: number;
  teleopSpeakerNoteAmplifiedPoints?: number;
  teleopSpeakerNoteCount?: number;
  teleopSpeakerNotePoints?: number;
  teleopTotalNotePoints?: number;
  totalPoints?: number;
  trapCenterStage?: boolean;
  trapStageLeft?: boolean;
  trapStageRight?: boolean;
}

/** See the 2025 FMS API documentation for a description of each value. https://frc-api-docs.firstinspires.org */
export interface BlueAllianceMatchScoreBreakdown2025 {
  blue: BlueAllianceMatchScoreBreakdown2025Alliance;
  red: BlueAllianceMatchScoreBreakdown2025Alliance;
}

export interface BlueAllianceMatchScoreBreakdown2025Alliance {
  adjustPoints?: number;
  algaePoints?: number;
  autoBonusAchieved?: boolean;
  autoCoralCount?: number;
  autoCoralPoints?: number;
  autoLineRobot1?: "No" | "Yes";
  autoLineRobot2?: "No" | "Yes";
  autoLineRobot3?: "No" | "Yes";
  autoMobilityPoints?: number;
  autoPoints?: number;
  autoReef?: {
    topRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    midRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    botRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    trough: number;
    /** Unofficial TBA-computed value that sums the total number of game pieces scored in the botRow object. */
    tba_botRowCount?: number;
    /** Unofficial TBA-computed value that sums the total number of game pieces scored in the midRow object. */
    tba_midRowCount?: number;
    /** Unofficial TBA-computed value that sums the total number of game pieces scored in the topRow object. */
    tba_topRowCount?: number;
  };
  bargeBonusAchieved?: boolean;
  coopertitionCriteriaMet?: boolean;
  coralBonusAchieved?: boolean;
  endGameBargePoints?: number;
  endGameRobot1?: "None" | "Parked" | "ShallowCage" | "DeepCage";
  endGameRobot2?: "None" | "Parked" | "ShallowCage" | "DeepCage";
  endGameRobot3?: "None" | "Parked" | "ShallowCage" | "DeepCage";
  foulCount?: number;
  foulPoints?: number;
  g206Penalty?: boolean;
  g408Penalty?: boolean;
  g424Penalty?: boolean;
  netAlgaeCount?: number;
  rp?: number;
  techFoulCount?: number;
  teleopCoralCount?: number;
  teleopCoralPoints?: number;
  teleopPoints?: number;
  teleopReef?: {
    topRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    midRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    botRow: {
      nodeA: boolean;
      nodeB: boolean;
      nodeC: boolean;
      nodeD: boolean;
      nodeE: boolean;
      nodeF: boolean;
      nodeG: boolean;
      nodeH: boolean;
      nodeI: boolean;
      nodeJ: boolean;
      nodeK: boolean;
      nodeL: boolean;
    };
    trough: number;
    /** Unofficial TBA-computed value that sums the total number of game pieces scored in the botRow object. */
    tba_botRowCount?: number;
    /** Unofficial TBA-computed value that sums the total number of game pieces scored in the midRow object. */
    tba_midRowCount?: number;
    /** Unofficial TBA-computed value that sums the total number of game pieces scored in the topRow object. */
    tba_topRowCount?: number;
  };
  totalPoints?: number;
  wallAlgaeCount?: number;
}

/** The `Media` object contains a reference for most any media associated with a team or event on TBA. */
export interface BlueAllianceMedia {
  /** String type of the media element. */
  type:
    | "youtube"
    | "cdphotothread"
    | "imgur"
    | "facebook-profile"
    | "youtube-channel"
    | "twitter-profile"
    | "github-profile"
    | "instagram-profile"
    | "periscope-profile"
    | "gitlab-profile"
    | "grabcad"
    | "instagram-image"
    | "external-link"
    | "avatar";
  /** The key used to identify this media on the media site. */
  foreign_key: string;
  /** If required, a JSON dict of additional media information. */
  details?: Record<string, any>;
  /** True if the media is of high quality. */
  preferred?: boolean;
  /** List of teams that this media belongs to. Most likely length 1. */
  team_keys: string[];
  /** Direct URL to the media. */
  direct_url?: string;
  /** The URL that leads to the full web page for the media, if one exists. */
  view_url?: string;
}

export interface BlueAllianceEliminationAlliance {
  /** Alliance name, may be null. */
  name?: string | null;
  /** Backup team called in, may be null. */
  backup?: {
    /** Team key that was called in as the backup. */
    in: string;
    /** Team key that was replaced by the backup team. */
    out: string;
  } | null;
  /** List of teams that declined the alliance. */
  declines: string[];
  /** List of team keys picked for the alliance. First pick is captain. */
  picks: string[];
  status?: {
    /** @format double */
    playoff_average?: number;
    level?: string;
    record?: BlueAllianceWLTRecord | null;
    current_level_record?: BlueAllianceWLTRecord | null;
    status?: string;
  };
}

export interface BlueAllianceAward {
  /** The name of the award as provided by FIRST. May vary for the same award type. */
  name: string;
  /** Type of award given. See https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/award_type.py#L6 */
  award_type: number;
  /** The event_key of the event the award was won at. */
  event_key: string;
  /** A list of recipients of the award at the event. May have either a team_key or an awardee, both, or neither (in the case the award wasn't awarded at the event). */
  recipient_list: BlueAllianceAwardRecipient[];
  /** The year this award was won. */
  year: number;
}

/** An `Award_Recipient` object represents the team and/or person who received an award at an event. */
export interface BlueAllianceAwardRecipient {
  /** The TBA team key for the team that was given the award. May be null. */
  team_key: string | null;
  /** The name of the individual given the award. May be null. */
  awardee: string | null;
}

export interface BlueAllianceDistrictList {
  /** The short identifier for the district. */
  abbreviation: string;
  /** The long name for the district. */
  display_name: string;
  /** Key for this district, e.g. `2016ne`. */
  key: string;
  /** Year this district participated. */
  year: number;
}

/** Rank of a team in a district. */
export interface BlueAllianceDistrictRanking {
  /** TBA team key for the team. */
  team_key: string;
  /** Numerical rank of the team, 1 being top rank. */
  rank: number;
  /** Any points added to a team as a result of the rookie bonus. */
  rookie_bonus?: number;
  /** Total district points for the team. */
  point_total: number;
  /** List of events that contributed to the point total for the team. */
  event_points?: {
    /** `true` if this event is a District Championship event. */
    district_cmp: boolean;
    /** Total points awarded at this event. */
    total: number;
    /** Points awarded for alliance selection. */
    alliance_points: number;
    /** Points awarded for elimination match performance. */
    elim_points: number;
    /** Points awarded for event awards. */
    award_points: number;
    /** TBA Event key for this event. */
    event_key: string;
    /** Points awarded for qualification match performance. */
    qual_points: number;
  }[];
}

/** A Win-Loss-Tie record for a team, or an alliance. */
export interface BlueAllianceWLTRecord {
  /** Number of losses. */
  losses: number;
  /** Number of wins. */
  wins: number;
  /** Number of ties. */
  ties: number;
}

export interface BlueAllianceWebcast {
  /** Type of webcast, typically descriptive of the streaming provider. */
  type:
    | "youtube"
    | "twitch"
    | "ustream"
    | "iframe"
    | "html5"
    | "rtmp"
    | "livestream"
    | "direct_link"
    | "mms"
    | "justin"
    | "stemtv"
    | "dacast";
  /** Type specific channel information. May be the YouTube stream, or Twitch channel name. In the case of iframe types, contains HTML to embed the stream in an HTML iframe. */
  channel: string;
  /** The date for the webcast in `yyyy-mm-dd` format. May be null. */
  date?: string | null;
  /** File identification as may be required for some types. May be null. */
  file?: string | null;
}

export interface BlueAllianceLeaderboardInsight {
  data: {
    rankings: {
      /** Value of the insight that the corresponding team/event/matches have, e.g. number of blue banners, or number of matches played. */
      value: number;
      /** Team/Event/Match keys that have the corresponding value. */
      keys: string[];
    }[];
    /** What type of key is used in the rankings; either 'team', 'event', or 'match'. */
    key_type: "team" | "event" | "match";
  };
  /** Name of the insight. */
  name: string;
  /** Year the insight was measured in (year=0 for overall insights). */
  year: number;
}

export interface BlueAllianceNotablesInsight {
  data: {
    entries: {
      /** A list of events this team achieved the notable at. This type may change over time. */
      context: string[];
      team_key: string;
    }[];
  };
  name: string;
  year: number;
}

export interface BlueAllianceHistory {
  events: BlueAllianceEvent[];
  awards: BlueAllianceAward[];
}

export interface BlueAllianceSearchIndex {
  teams: {
    key: string;
    nickname: string;
  }[];
  events: {
    key: string;
    name: string;
  }[];
}
