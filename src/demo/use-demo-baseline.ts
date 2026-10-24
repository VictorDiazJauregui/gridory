/**
 * `?baseline=1` renders the table and kanban demos without the props added after
 * 1.0.1, so their screenshots can be compared pixel by pixel with that release.
 */
export const isDemoBaseline = () =>
  new URLSearchParams(window.location.search).get("baseline") === "1";
