import dashboard from "@design/figma/exports/RESONANCE_PLAT_DASH_FRAME_struct.json";
import chat from "@design/figma/exports/RESONANCE_SCR-01_CHAT_SKEL_struct.json";
import notebook from "@design/figma/exports/RESONANCE_SCR-02_NOTE_SKEL_struct.json";
import theme from "@design/figma/exports/RESONANCE_SCR-03_THEME_SKEL_struct.json";
import pod from "@design/figma/exports/RESONANCE_SCR-05_POD_SKEL_struct.json";
import map from "@design/figma/exports/RESONANCE_SCR-06_RMAP_SKEL_struct.json";

import type { ScreenSpec } from "./screen-schema";

const screens = [dashboard, chat, notebook, theme, pod, map] satisfies ScreenSpec[];

const screenMap = new Map<string, ScreenSpec>(screens.map((spec) => [spec.route, spec]));

export function getScreen(route: string): ScreenSpec | undefined {
  return screenMap.get(route);
}

export function requireScreen(route: string): ScreenSpec {
  const result = getScreen(route);
  if (!result) {
    throw new Error(`Screen spec for route "${route}" was not found.`);
  }
  return result;
}

export function listScreens(): ScreenSpec[] {
  return screens;
}

export function screenRouteToSlug(route: string): string {
  const normalized = route.startsWith("/") ? route.slice(1) : route;
  return normalized.length > 0 ? normalized : "dashboard";
}

export function screenSlugToRoute(slug: string): string {
  if (!slug) return "/dashboard";
  const normalized = slug.startsWith("/") ? slug : `/${slug}`;
  return normalized === "/" ? "/dashboard" : normalized;
}
