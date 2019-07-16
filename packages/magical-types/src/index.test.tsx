import React from "react";
import { render } from "@testing-library/react";
import { PropTypes } from "magical-types/macro";
import { MyComponentThatDoesStuff as SomeComp } from "../../../comp";

type Thing = (firstArg: string) => number;

type Props = {
  /* Some description for this */
  a: boolean;
  b: any;
  c: "some string";
  d: "some string" | "something";
  e: Thing;
};

type PropsAlias = Props;

let MyComponentThatDoesStuff = (props: PropsAlias) => {
  return null;
};

test("it works", () => {
  let { container } = render(
    <PropTypes component={MyComponentThatDoesStuff} />
  );
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
                  a
                </span>
              </span>
              <span
                class="css-fr8k13-Type"
              >
                boolean
              </span>
            </div>
            <div>
              <span
                class="css-1wt60gk-TypeMinWidth"
              >
                <span
                  class="css-fr8k13-Type"
                >
                  b
                </span>
              </span>
              <span
                class="css-fr8k13-Type"
              >
                any
              </span>
            </div>
            <div>
              <span
                class="css-1wt60gk-TypeMinWidth"
              >
                <span
                  class="css-fr8k13-Type"
                >
                  c
                </span>
              </span>
              <span
                class="css-d46q2u-StringType"
              >
                "
                some string
                "
              </span>
            </div>
            <div>
              <span
                class="css-1wt60gk-TypeMinWidth"
              >
                <span
                  class="css-fr8k13-Type"
                >
                  d
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
                      class="css-d46q2u-StringType"
                    >
                      "
                      some string
                      "
                    </span>
                    , 
                  </div>
                  <div>
                    <span
                      class="css-d46q2u-StringType"
                    >
                      "
                      something
                      "
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
            <div>
              <span
                class="css-1wt60gk-TypeMinWidth"
              >
                <span
                  class="css-fr8k13-Type"
                >
                  e
                </span>
              </span>
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
                  firstArg
                  
                  :
                   
                </span>
                <span
                  class="css-fr8k13-Type"
                >
                  string
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
                  number
                </span>
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
