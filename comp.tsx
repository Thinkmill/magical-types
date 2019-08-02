import React from "react";
import { RawTypes } from "magical-types/macro";
import Select from "react-select/base";

type SomeType = { thing?: boolean };

<RawTypes<SomeType> />;
