import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { Form } from "./App";

it("fragment", () => {
  const { asFragment } = render(<Form onSubmit={() => void 0} />);
  expect(asFragment()).toMatchSnapshot();
});

