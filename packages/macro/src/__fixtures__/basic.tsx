import { getNode } from "@magical-types/macro";

type Something = {
  color: string;
};

let x = getNode<Something>();
