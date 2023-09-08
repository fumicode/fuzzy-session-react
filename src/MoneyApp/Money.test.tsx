import React from "react";
import { render, screen } from "@testing-library/react";
import MoneyApp from "./MoneyApp";

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Fuzzy/i);
  expect(linkElement).toBeInTheDocument();
});

