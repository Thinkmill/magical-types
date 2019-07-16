import React from "react";
import { render } from "@testing-library/react";
import { RawTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as SomeComp } from "../../../comp";

test("it works", () => {
  type Something = { thing: boolean };
  let { container } = render(<RawTypes<Something> />);
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="css-1cf4d7"
      >
        <span>
          <span
            class="css-yekgsh-TypeMeta"
          >
            Something
          </span>
          <button
            class="css-e509v-StateBit"
            type="button"
          >
            {
          </button>
          <div
            class="css-1x0u41u-Indent"
          >
            <div>
              <span
                class="css-1wt60gk-TypeMinWidth"
              >
                <span
                  class="css-fr8k13-Type"
                >
                  thing
                </span>
              </span>
              <span
                class="css-fr8k13-Type"
              >
                boolean
              </span>
            </div>
          </div>
          <button
            class="css-e509v-StateBit"
            type="button"
          >
            }
          </button>
        </span>
      </div>
    </div>
  `);
});
