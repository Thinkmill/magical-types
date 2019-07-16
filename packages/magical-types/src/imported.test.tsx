import React from "react";
import { render } from "@testing-library/react";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as SomeComp } from "../../../comp";

test("it works", () => {
  let { container } = render(<PropTypes component={SomeComp} />);
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="css-1cf4d7"
      >
        <span>
          <span
            class="css-yekgsh-TypeMeta"
          >
            Props
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
                  children
                </span>
              </span>
              <span>
                <span
                  class="css-yekgsh-TypeMeta"
                >
                  
                  One of
                   
                </span>
                <button
                  class="css-e509v-StateBit"
                  type="button"
                >
                  &lt;
                </button>
                <div
                  class="css-1x0u41u-Indent"
                >
                  <div>
                    <span
                      class="css-fr8k13-Type"
                    >
                      undefined
                    </span>
                    , 
                  </div>
                  <div>
                    <span>
                      <span
                        class="css-yekgsh-TypeMeta"
                      >
                        class 
                        Thing
                      </span>
                      <button
                        class="css-e509v-StateBit"
                        type="button"
                      >
                        {
                      </button>
                      <button
                        class="css-e509v-StateBit"
                        type="button"
                      >
                        ...
                      </button>
                      <button
                        class="css-e509v-StateBit"
                        type="button"
                      >
                        }
                      </button>
                    </span>
                    
                  </div>
                </div>
                <button
                  class="css-e509v-StateBit"
                  type="button"
                >
                  &gt;
                </button>
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
