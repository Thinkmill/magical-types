import React from "react";
import { render } from "@testing-library/react";
import { PropTypes } from "magical-types/macro";

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
        class="css-r69ve0-Wrapper"
      >
        <h2
          class="css-o41ti2"
        >
          Props
        </h2>
        <div
          class="css-oh232t-PropTypeWrapper"
        >
          <h3
            class="css-z92blb-Heading"
          >
            <code
              class="css-f88zer-HeadingName"
            >
              a
            </code>
             
            <code
              class="css-nu8k78-HeadingRequired"
            >
               required
            </code>
          </h3>
          
          <div
            class="css-1cf4d7"
          >
            <span
              class="css-fr8k13-Type"
            >
              boolean
            </span>
          </div>
        </div>
        <div
          class="css-oh232t-PropTypeWrapper"
        >
          <h3
            class="css-z92blb-Heading"
          >
            <code
              class="css-f88zer-HeadingName"
            >
              b
            </code>
             
            <code
              class="css-nu8k78-HeadingRequired"
            >
               required
            </code>
          </h3>
          
          <div
            class="css-1cf4d7"
          >
            <span
              class="css-fr8k13-Type"
            >
              any
            </span>
          </div>
        </div>
        <div
          class="css-oh232t-PropTypeWrapper"
        >
          <h3
            class="css-z92blb-Heading"
          >
            <code
              class="css-f88zer-HeadingName"
            >
              c
            </code>
             
            <code
              class="css-nu8k78-HeadingRequired"
            >
               required
            </code>
          </h3>
          
          <div
            class="css-1cf4d7"
          >
            <span
              class="css-d46q2u-StringType"
            >
              "
              some string
              "
            </span>
          </div>
        </div>
        <div
          class="css-oh232t-PropTypeWrapper"
        >
          <h3
            class="css-z92blb-Heading"
          >
            <code
              class="css-f88zer-HeadingName"
            >
              d
            </code>
             
            <code
              class="css-nu8k78-HeadingRequired"
            >
               required
            </code>
          </h3>
          
          <div
            class="css-1cf4d7"
          >
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
        </div>
        <div
          class="css-oh232t-PropTypeWrapper"
        >
          <h3
            class="css-z92blb-Heading"
          >
            <code
              class="css-f88zer-HeadingName"
            >
              e
            </code>
             
            <code
              class="css-nu8k78-HeadingRequired"
            >
               required
            </code>
          </h3>
          
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
      </div>
    </div>
  `);
});
