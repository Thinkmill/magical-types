import React from "react";
import { PropTypes, RawTypes } from "magical-types/macro";
import Select from "react-select/base";

class Thing {
  x: string = "";
}

type Props = {
  children?: Thing;
};

type PropsAlias = Props;

// export let MyComponentThatDoesStuff = (props: Select) => {
//   return null;
// };

// type MyThingPlsWork<R = any> = {
//   doAThing<T>({ writable }: { writable: MyThingPlsWork<T> }): MyThingPlsWork<T>;
// };
type MyThingPlsWork<R = any> = {
  doAThing<T>(ohLookThisIsAnArg: string): MyThingPlsWork<T>;
};

<PropTypes component={Select} />;
