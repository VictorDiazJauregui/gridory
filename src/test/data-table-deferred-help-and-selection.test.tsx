import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import type { HeaderCheckState } from "../components/table/selection/row-selection";

const SELECT_CHECKBOX = "../components/table/selection/SelectCheckbox";
const HEADER_HELP = "../components/table/header/TableHeaderHelp";

// A fresh module graph per test: the deferred pieces are downloaded once per page, as in an app.
const importFresh = async () => {
  vi.resetModules();
  const { DeferredSelectCheckbox } = await import("../components/table/selection/DeferredSelectCheckbox");
  const { DeferredTableHeaderHelp } = await import("../components/table/header/DeferredTableHeaderHelp");
  return { DeferredSelectCheckbox, DeferredTableHeaderHelp };
};

afterEach(() => {
  vi.doUnmock(SELECT_CHECKBOX);
  vi.doUnmock(HEADER_HELP);
});

const CHECK_STATES: [HeaderCheckState, boolean][] = [
  [false, false], [false, true], [true, false], [true, true], ["indeterminate", false], ["indeterminate", true],
];

test.each(CHECK_STATES)("the checkbox placeholder (%s, disabled %s) has the markup of the real one", async (checked, disabled) => {
  const { DeferredSelectCheckbox } = await importFresh();
  const props = { checked, disabled, label: "Seleccionar fila", onToggle: () => {} };
  const placeholder = render(<DeferredSelectCheckbox {...props} />).container.innerHTML;
  const { SelectCheckbox } = await import(SELECT_CHECKBOX);
  expect(render(<SelectCheckbox {...props} />).container.innerHTML).toBe(placeholder);
});

test("the help placeholder has the markup of the closed tooltip trigger", async () => {
  const { DeferredTableHeaderHelp } = await importFresh();
  const placeholder = render(<DeferredTableHeaderHelp text="Ayuda" label="Ayuda sobre Usuarios" />).container.innerHTML;
  const { TableHeaderHelp } = await import(HEADER_HELP);
  expect(render(<TableHeaderHelp text="Ayuda" label="Ayuda sobre Usuarios" />).container.innerHTML).toBe(placeholder);
});

test("a press on the ? before the tooltip arrives opens it on arrival", async () => {
  const { DeferredTableHeaderHelp } = await importFresh();
  const { findByRole, getByRole } = render(<DeferredTableHeaderHelp text="Ayuda larga" label="Ayuda sobre Usuarios" />);
  fireEvent.click(getByRole("button", { name: "Ayuda sobre Usuarios" }));
  expect(await findByRole("tooltip")).toHaveTextContent("Ayuda larga");
});

test("a focused checkbox placeholder hands the focus to the real checkbox", async () => {
  const { DeferredSelectCheckbox } = await importFresh();
  const { container } = render(<DeferredSelectCheckbox checked={false} label="Fila" onToggle={() => {}} />);
  const placeholder = container.querySelector("button") as HTMLButtonElement;
  act(() => placeholder.focus());
  await waitFor(() => expect(container.querySelector("button")).not.toBe(placeholder));
  expect(container.querySelector("button")).toHaveFocus();
});

test("a focused ? hands the focus to the tooltip trigger, which opens as on focus", async () => {
  const { DeferredTableHeaderHelp } = await importFresh();
  const { container, findByRole } = render(<DeferredTableHeaderHelp text="Ayuda larga" label="Ayuda sobre Usuarios" />);
  const placeholder = container.querySelector("button") as HTMLButtonElement;
  act(() => placeholder.focus());
  await waitFor(() => expect(container.querySelector("button")).not.toBe(placeholder));
  expect(container.querySelector("button")).toHaveFocus();
  expect(await findByRole("tooltip")).toHaveTextContent("Ayuda larga");
});

test("the checkbox placeholder toggles with a click and Space, not with Enter", async () => {
  const { DeferredSelectCheckbox } = await importFresh();
  const onToggle = vi.fn();
  const { getByRole } = render(<DeferredSelectCheckbox checked={false} label="Fila" onToggle={onToggle} />);
  const checkbox = getByRole("checkbox", { name: "Fila" });
  expect(fireEvent.keyDown(checkbox, { key: "Enter" })).toBe(false);
  fireEvent.click(checkbox);
  expect(onToggle).toHaveBeenCalledOnce();
});

const failDownload = (path: string) =>
  vi.doMock(path, () => {
    throw new Error("chunk not found");
  });

// Once the file is back, the download brings a marked stand-in, so the test sees the retry arrive.
const restoreDownload = (path: string, exportName: string) => {
  vi.doUnmock(path);
  vi.doMock(path, () => ({ [exportName]: () => <span data-testid="downloaded" /> }));
};

const waitForFailedDownloads = () => new Promise((resolve) => setTimeout(resolve, 50));

test("when the checkbox cannot be downloaded it still toggles, and that click downloads it again", async () => {
  failDownload(SELECT_CHECKBOX);
  const { DeferredSelectCheckbox } = await importFresh();
  const onToggle = vi.fn();
  const { findByTestId, getByRole } = render(<DeferredSelectCheckbox checked={false} label="Fila" onToggle={onToggle} />);
  await waitForFailedDownloads();
  restoreDownload(SELECT_CHECKBOX, "SelectCheckbox");
  fireEvent.click(getByRole("checkbox", { name: "Fila" }));
  expect(onToggle).toHaveBeenCalledOnce();
  expect(await findByTestId("downloaded")).toBeInTheDocument();
});

test("when the help cannot be downloaded the ? stays, and a click downloads it again", async () => {
  failDownload(HEADER_HELP);
  const { DeferredTableHeaderHelp } = await importFresh();
  const { findByTestId, getByRole } = render(<DeferredTableHeaderHelp text="Ayuda" label="Ayuda sobre Usuarios" />);
  await waitForFailedDownloads();
  restoreDownload(HEADER_HELP, "TableHeaderHelp");
  fireEvent.click(getByRole("button", { name: "Ayuda sobre Usuarios" }));
  expect(await findByTestId("downloaded")).toBeInTheDocument();
});
