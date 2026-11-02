import { expectTypeOf, test } from "vitest";
import type { ColumnDefinition, ColumnPin, HeaderTooltipPlacement } from "../kanban";

type Company = { name: string };

test("gridory/kanban exports the types of the table-only column fields, like gridory/table", () => {
  expectTypeOf<ColumnPin>().toEqualTypeOf<NonNullable<ColumnDefinition<Company>["pin"]>>();
  expectTypeOf<HeaderTooltipPlacement>().toEqualTypeOf<
    NonNullable<ColumnDefinition<Company>["headerTooltipPlacement"]>
  >();
});
