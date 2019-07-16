import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as AnotherComp } from "../../comp";

// type Thing = (firstArg: string) => number;

type Status = "notstarted" | "started" | "inprogress" | "completed";

type Task = { id: string; status: Status; title: string };

type Props = {
  /** The tasks that the board should render */
  tasks: Array<Task>;
  /** A function that will be called.
   * Important Note: this is the _changed_ tasks, **not** all of the new tasks.
   */
  onTasksChange: (changedTasks: Array<Task>) => void;
};

type PropsAlias = Props;

let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

let MyOtherComponent = (props: {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
}) => {
  return <div {...props as any} />;
};

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      <PropTypes component={MyComponentThatDoesStuff} />
      <PropTypes component={MyOtherComponent} />
    </div>
  );
};
