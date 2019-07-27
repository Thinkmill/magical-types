import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { PropTypes } from "magical-types/macro";
import Select from "react-select/base";

// type Thing = (firstArg: string) => number;

type Status = "notstarted" | "started" | "inprogress" | "completed";

type Task = { id: string; status: Status; title: string; task: Task };

type Props = {
  /** The tasks that the board should render */
  tasks: Array<Task>;
  /** A function that will be called.
   * Important Note: this is the _changed_ tasks, **not** all of the new tasks.
   */
  onTasksChange: (changedTasks: Array<Task>) => void;
};

let MyComponentThatDoesStuff = (props: Props) => {
  return null;
};

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      <PropTypes component={MyComponentThatDoesStuff} />
      <PropTypes component={Select} />
    </div>
  );
};
