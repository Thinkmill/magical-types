import React from "react";
import { render } from "@testing-library/react";
import { FunctionTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as SomeComp } from "../../../comp";

test("it works", () => {
  function someThing(thing: boolean) {}
  let { container } = render(<FunctionTypes function={someThing} />);
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="css-1cf4d7"
      >
        <span>
          <button
            class="css-e509v-StateBit"
            type="button"
          >
            (
          </button>
          <span
            class="css-fr8k13-Type"
          >
            thing
            
            :
             
          </span>
          <span
            class="css-fr8k13-Type"
          >
            boolean
          </span>
          
          <button
            class="css-e509v-StateBit"
            type="button"
          >
            )
          </button>
          <span
            class="css-ftc9nv-Arrow"
          >
             =&gt; 
          </span>
          <span
            class="css-fr8k13-Type"
          >
            void
          </span>
        </span>
      </div>
    </div>
  `);
});
