import React from "react";
import { PropTypes } from "magical-types/macro";

class Thing {
  x: string = "";
}

type Props = {
  children?: Thing;
};

type PropsAlias = Props;

export let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

<PropTypes component={MyComponentThatDoesStuff} />;
