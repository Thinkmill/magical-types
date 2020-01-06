import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import {
  PropTypes,
  FunctionTypes
} from "@magical-types/macro/write-data-to-fs.macro";
import { components } from "react-select";

// type Thing = (firstArg: string) => number;

type Status = "notstarted" | "started" | "inprogress" | "completed";

type Task = { id: string; status: Status; title: string; task: Task };

let thing = {
  wow: "string"
} as const;

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

function myFunc(someArg: { thing?: string }, another: typeof thing) {}

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      <h1>Hey there! This is magical-types.</h1>
      <p>
        It's pretty work in progress right now but below you can see all the
        prop types for react-select
      </p>
      {/* <PropTypes component={MyComponentThatDoesStuff} /> */}
      {/* <FunctionTypes function={myFunc} /> */}
      <PropTypes component={components.Control} />
    </div>
  );
};
