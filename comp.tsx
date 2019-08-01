import React from "react";
import { FunctionTypes } from "magical-types/macro";
import Select from "react-select/base";

function myFunc<Something>(
  someArg: Something,
  anotherArg: Something extends string ? boolean : number
) {}

<FunctionTypes function={myFunc} />;
