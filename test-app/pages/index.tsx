import React from "react";
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { PropTypes, FunctionTypes, RawTypes } from "magical-types/macro";
import Select from "react-select/base";

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

type AnOkayishType<FirstOne, Thing extends FirstOne> = {
  thing: Thing;
  other: FirstOne;
};

type A = string;
type B = "wow";

export default () => {
  return (
    <div css={{ fontFamily: "sans-serif" }}>
      something
      {/* <PropTypes component={MyComponentThatDoesStuff} /> */}
      {/* <FunctionTypes function={myFunc} /> */}
      <RawTypes<AnOkayishType<A, B>> />
    </div>
  );
};
