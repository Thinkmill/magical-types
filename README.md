# 🔮 magical-types

> Document React components and other stuff typed with TypeScript _magically_

## Getting Started

### Installing babel-plugin-macros

magical-types is used as a [Babel Macro](https://github.com/kentcdodds/babel-plugin-macros). Unless you're using Create React App or Gatsby, you'll need to install it and add it to your Babel config.

```bash
yarn add babel-plugin-macros
```

```json
{
  "plugins": ["babel-plugin-macros"]
}
```

### Installing magical-types

```bash
yarn add magical-types
```

### Using it

```tsx
import { PropTypes, FunctionTypes, RawTypes } from "magical-types/macro";

type Props = {
  someProp: string;
};

let MyComponent = (props: Props) => {
  return <div />;
};

<PropTypes component={MyComponent} />;

function myFunctionThatDoesCoolStuff(someArgument: { thing: true }) {}

<FunctionTypes function={myFunctionThatDoesCoolStuff} />;

type SomeObject = { someProperty: boolean };

<RawTypes<SomeObject> />;

function someFunctionThatReturnsAComponent() {
  return MyComponent;
}

let AnotherComp = someFunctionThatReturnsAComponent();

<PropTypes component={AnotherComp} />;
```

## Credit/Inspiration

This project is mostly some ideas that I've been thinking about because of some of the constraints in [react-docgen](https://github.com/reactjs/react-docgen), [react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript) and [extract-react-types](https://github.com/atlassian/extract-react-types) and how some problems could be removed by changing some constraints, notably the removal of having to know what is and isn't a React component.

The code for rendering types is **heavily** based off [pretty-proptypes](https://github.com/atlassian/extract-react-types/tree/master/packages/pretty-proptypes)
