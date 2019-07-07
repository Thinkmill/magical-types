# magical-types

> Document stuff typed with TypeScript _magically_

**THIS IS ONLY WHAT I THINK THIS THING MIGHT LOOK LIKE. THIS DOES NOT ACTUALLY WORK YET.**

## Getting Started

magical-types can be used as a [Babel Macro](https://github.com/kentcdodds/babel-plugin-macros).

### Installing

```bash
yarn add magical-types
```

### Using it

```tsx
import { PropTypes, FunctionTypes } from "magical-types/macro";

type Props = {
  someProp: string;
};

let MyComponent = (props: Props) => {
  return <div />;
};

<PropTypes component={MyComponent} />;

function myFunctionThatDoesCoolStuff(someArgument: { thing: true }) {}

<FunctionTypes function={myFunctionThatDoesCoolStuff} />;
```
