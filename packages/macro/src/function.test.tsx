import React from "react";
import { render } from "@testing-library/react";
import { FunctionTypes } from "@magical-types/macro";

test("it works", () => {
  function someThing(thing: boolean) {}
  let { container } = render(<FunctionTypes function={someThing} />);
  expect(container).toMatchInlineSnapshot(`
    .emotion-8 {
      font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
    }

    .emotion-0 {
      background-color: #F4F5F7;
      color: #5E6C84;
      border: 0;
      font-size: 14px;
      line-height: 20px;
      width: auto;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-0:hover,
    .emotion-0:hover ~ .state-bit,
    .state-bit ~ .emotion-0:hover {
      background-color: #6554C0;
      color: white;
    }

    .emotion-1 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-4 {
      color: #006644;
    }

    <div>
      <div
        class="emotion-8"
      >
        <span>
          
          <button
            class="state-bit emotion-0"
            type="button"
          >
            (
          </button>
          <span
            class="emotion-1"
          >
            thing
            
            :
             
          </span>
          <span
            class="emotion-1"
          >
            boolean
          </span>
          
          <button
            class="state-bit emotion-0"
            type="button"
          >
            )
          </button>
          <span
            class="emotion-4"
          >
             =&gt; 
          </span>
          <button
            class="state-bit emotion-0"
            type="button"
          />
          <span
            class="emotion-1"
          >
            void
          </span>
          <button
            class="state-bit emotion-0"
            type="button"
          />
        </span>
      </div>
    </div>
  `);
});
