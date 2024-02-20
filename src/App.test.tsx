import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("とりあえずレンダリングできる", () => {
    render(<App />);
    const osTitle = screen.getByText(/DouOS/i);
    expect(osTitle).toBeInTheDocument();
  });
});
