import { getNode } from "@magical-types/macro";
import { ComponentProps, JSXElementConstructor } from "react";

let x = getNode<{
  thing: <
    T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
  >() => ComponentProps<T>;
}>();
