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
    .emotion-36 {
      margin-top: 12px;
      font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New, monospace;
    }

    @media (min-width:780px) {
      .emotion-36 {
        margin-bottom: 24px;
        margin-top: 24px;
      }
    }

    .emotion-0 {
      margin-top: 1em;
    }

    .emotion-5 {
      margin-top: 32px;
    }

    .emotion-3 {
      border-bottom: 2px solid #F4F5F7;
      font-size: 0.9rem;
      font-weight: normal;
      line-height: 1.4;
      margin: 0 0 8px 0;
      padding-bottom: 8px;
    }

    .emotion-1 {
      background: #DEEBFF;
      color: #0747A6;
      border-radius: 3px;
      display: inline-block;
      margin-right: 0.8em;
      padding: 0 0.2em;
    }

    .emotion-2 {
      color: #BF2600;
    }

    .emotion-4 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-14 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
      background-color: #E3FCEF;
      color: #006644;
    }

    .emotion-19 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
      background-color: #F4F5F7;
      color: #5E6C84;
    }

    .emotion-20 {
      background-color: #F4F5F7;
      color: #5E6C84;
      border: 0;
      font-size: 14px;
      line-height: 20px;
      width: auto;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-20:hover,
    .emotion-20:hover ~ .state-bit,
    .state-bit ~ .emotion-20:hover {
      background-color: #6554C0;
      color: white;
    }

    .emotion-23 {
      padding-left: 1.3em;
    }

    .emotion-33 {
      color: #006644;
    }

    <div>
      <div
        class="emotion-36"
      >
        <h2
          class="emotion-0"
        >
          Props
        </h2>
        <div
          class="emotion-5"
        >
          <h3
            class="emotion-3"
          >
            <code
              class="emotion-1"
            >
              a
            </code>
             
            <code
              class="emotion-2"
            >
               required
            </code>
          </h3>
          
          <span
            class="emotion-4"
          >
            boolean
          </span>
        </div>
        <div
          class="emotion-5"
        >
          <h3
            class="emotion-3"
          >
            <code
              class="emotion-1"
            >
              b
            </code>
             
            <code
              class="emotion-2"
            >
               required
            </code>
          </h3>
          
          <span
            class="emotion-4"
          >
            any
          </span>
        </div>
        <div
          class="emotion-5"
        >
          <h3
            class="emotion-3"
          >
            <code
              class="emotion-1"
            >
              c
            </code>
             
            <code
              class="emotion-2"
            >
               required
            </code>
          </h3>
          
          <span
            class="emotion-14"
          >
            "
            some string
            "
          </span>
        </div>
        <div
          class="emotion-5"
        >
          <h3
            class="emotion-3"
          >
            <code
              class="emotion-1"
            >
              d
            </code>
             
            <code
              class="emotion-2"
            >
               required
            </code>
          </h3>
          
          <span>
            <span
              class="emotion-19"
            >
              
              One of
               
            </span>
            <button
              class="state-bit emotion-20"
              type="button"
            >
              &lt;
            </button>
            <div
              class="emotion-23"
            >
              <div>
                <span
                  class="emotion-14"
                >
                  "
                  some string
                  "
                </span>
                , 
              </div>
              <div>
                <span
                  class="emotion-14"
                >
                  "
                  something
                  "
                </span>
                
              </div>
            </div>
            <button
              class="state-bit emotion-20"
              type="button"
            >
              &gt;
            </button>
          </span>
        </div>
        <div
          class="emotion-5"
        >
          <h3
            class="emotion-3"
          >
            <code
              class="emotion-1"
            >
              e
            </code>
             
            <code
              class="emotion-2"
            >
               required
            </code>
          </h3>
          
          <span>
            
            <button
              class="state-bit emotion-20"
              type="button"
            >
              (
            </button>
            <span
              class="emotion-4"
            >
              firstArg
              
              :
               
            </span>
            <span
              class="emotion-4"
            >
              string
            </span>
            
            <button
              class="state-bit emotion-20"
              type="button"
            >
              )
            </button>
            <span
              class="emotion-33"
            >
               =&gt; 
            </span>
            <span
              class="emotion-4"
            >
              number
            </span>
          </span>
        </div>
      </div>
    </div>
  `);
});
