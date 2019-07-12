import React from "react";
import { PropTypes } from "magical-types/macro";

type Thing = (firstArg: string) => number;

type Props = {
  children: React.ReactNode;
};

type PropsAlias = Props;

export let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

<PropTypes component={MyComponentThatDoesStuff} />;
