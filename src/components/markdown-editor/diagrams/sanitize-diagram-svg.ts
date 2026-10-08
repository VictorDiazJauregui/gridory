import DOMPurify from "dompurify";

const SVG_PROFILE = {
  USE_PROFILES: { svg: true, svgFilters: true },
  ADD_TAGS: ["style"],
  FORBID_TAGS: ["foreignObject", "script"],
};

export const sanitizeDiagramSvg = (svg: string): string => DOMPurify.sanitize(svg, SVG_PROFILE);
