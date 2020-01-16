import { thing } from "./b";

export function something(): { thing: boolean } | { something: string } {
  return thing;
}
