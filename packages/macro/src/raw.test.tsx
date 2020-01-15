import React from "react";
import { render } from "@testing-library/react";
import { RawTypes } from "@magical-types/macro";

test("it works", () => {
  type Something = { thing: boolean };
  let { container } = render(<RawTypes<Something> />);
  expect(container).toMatchInlineSnapshot(`
    .emotion-2 {
      font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace;
    }

    .emotion-0 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
      background-color: #F4F5F7;
      color: #5E6C84;
    }

    .emotion-1 {
      background-color: #F4F5F7;
      color: #5E6C84;
      border: 0;
      font-size: 14px;
      line-height: 20px;
      width: auto;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-1:hover,
    .emotion-1:hover ~ .state-bit,
    .state-bit ~ .emotion-1:hover {
      background-color: #6554C0;
      color: white;
    }

    <div>
      <div
        class="emotion-2"
      >
        <span>
          <span
            class="emotion-0"
          >
            Something
          </span>
          <button
            class="state-bit emotion-1"
            type="button"
          >
            {
            ...
            }
          </button>
        </span>
      </div>
    </div>
  `);
});
