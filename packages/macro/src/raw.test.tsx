import React from "react";
import { render } from "@testing-library/react";
import { RawTypes } from "@magical-types/macro";

test("it works", () => {
  type Something = { thing: boolean };
  let { container } = render(<RawTypes<Something> />);
  expect(container).toMatchInlineSnapshot(`
    .emotion-7 {
      font-family: sans-serif;
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
      font-family: sans-serif;
      line-height: 20px;
      width: auto;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    .emotion-1:hover {
      cursor: pointer;
    }

    .emotion-5 {
      padding-left: 1.3em;
    }

    .emotion-3 {
      display: inline-block;
      min-width: 60px;
    }

    .emotion-2 {
      background-color: #EAE6FF;
      border-radius: 3px;
      color: #403294;
      display: inline-block;
      margin: 2px 0;
      padding: 0 0.2em;
    }

    <div>
      <div
        class="emotion-7"
      >
        <span>
          <span
            class="emotion-0"
          >
            Something
          </span>
          <button
            class="emotion-1"
            type="button"
          >
            {
          </button>
          <div
            class="emotion-5"
          >
            <div>
              <span
                class="emotion-3"
              >
                <span
                  class="emotion-2"
                >
                  thing
                </span>
              </span>
              <span
                class="emotion-2"
              >
                boolean
              </span>
            </div>
          </div>
          <button
            class="emotion-1"
            type="button"
          >
            }
          </button>
        </span>
      </div>
    </div>
  `);
});
