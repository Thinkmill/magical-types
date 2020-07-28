import React from "react";
import { render } from "@testing-library/react";
import { PropTypes } from "@magical-types/macro";

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
    .emotion-37 {
      margin-top: 12px;
      font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New, monospace;
    }

    @media (min-width:780px) {
      .emotion-37 {
        margin-bottom: 24px;
        margin-top: 24px;
      }
    }

    .emotion-4 {
      margin-top: 32px;
    }

    .emotion-2 {
      border-bottom: 2px solid #F4F5F7;
      font-size: 0.9rem;
      font-weight: normal;
      line-height: 1.4;
      margin: 0 0 8px 0;
      padding-bottom: 8px;
    }

    .emotion-0 {
      background: #DEEBFF;
      color: #0747A6;
      border-radius: 3px;
      display: inline-block;
      margin-right: 0.8em;
      padding: 0 0.2em;
    }

    .emotion-1 {
      color: #BF2600;
    }

    .emotion-3 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-13 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
      background-color: #E3FCEF;
      color: #006644;
    }

    .emotion-18 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
      background-color: #F4F5F7;
      color: #5E6C84;
    }

    .emotion-19 {
      background-color: #F4F5F7;
      color: #5E6C84;
      border: 0;
      font-size: 14px;
      line-height: 20px;
      width: auto;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-19:hover,
    .emotion-19:hover ~ .state-bit,
    .state-bit ~ .emotion-19:hover {
      background-color: #6554C0;
      color: white;
    }

    .emotion-22 {
      padding-left: 1.3em;
    }

    .emotion-32 {
      color: #006644;
    }

    <div>
      <div
        class="emotion-37"
      >
        <div
          class="emotion-4"
        >
          <h3
            class="emotion-2"
          >
            <code
              class="emotion-0"
            >
              a
            </code>
             
            <code
              class="emotion-1"
            >
               required
            </code>
          </h3>
          
          <span
            class="emotion-3"
          >
            boolean
          </span>
        </div>
        <div
          class="emotion-4"
        >
          <h3
            class="emotion-2"
          >
            <code
              class="emotion-0"
            >
              b
            </code>
             
            <code
              class="emotion-1"
            >
               required
            </code>
          </h3>
          
          <span
            class="emotion-3"
          >
            any
          </span>
        </div>
        <div
          class="emotion-4"
        >
          <h3
            class="emotion-2"
          >
            <code
              class="emotion-0"
            >
              c
            </code>
             
            <code
              class="emotion-1"
            >
               required
            </code>
          </h3>
          
          <span
            class="emotion-13"
          >
            "
            some string
            "
          </span>
        </div>
        <div
          class="emotion-4"
        >
          <h3
            class="emotion-2"
          >
            <code
              class="emotion-0"
            >
              d
            </code>
             
            <code
              class="emotion-1"
            >
               required
            </code>
          </h3>
          
          <span>
            <span
              class="emotion-18"
            >
              undefined 
              One of 
            </span>
            <button
              class="state-bit emotion-19"
              type="button"
            >
              &lt;
            </button>
            <div
              class="emotion-22"
            >
              <div>
                <span
                  class="emotion-13"
                >
                  "
                  some string
                  "
                </span>
                , 
              </div>
              <div>
                <span
                  class="emotion-13"
                >
                  "
                  something
                  "
                </span>
                
              </div>
            </div>
            <button
              class="state-bit emotion-19"
              type="button"
            >
              &gt;
            </button>
          </span>
        </div>
        <div
          class="emotion-4"
        >
          <h3
            class="emotion-2"
          >
            <code
              class="emotion-0"
            >
              e
            </code>
             
            <code
              class="emotion-1"
            >
               required
            </code>
          </h3>
          
          <span>
            
            <button
              class="state-bit emotion-19"
              type="button"
            >
              (
            </button>
            <span
              class="emotion-3"
            >
              firstArg
              
              :
               
            </span>
            <span
              class="emotion-3"
            >
              string
            </span>
            
            <button
              class="state-bit emotion-19"
              type="button"
            >
              )
            </button>
            <span
              class="emotion-32"
            >
               =&gt; 
            </span>
            <button
              class="state-bit emotion-19"
              type="button"
            />
            <span
              class="emotion-3"
            >
              number
            </span>
            <button
              class="state-bit emotion-19"
              type="button"
            />
          </span>
        </div>
      </div>
    </div>
  `);
});
