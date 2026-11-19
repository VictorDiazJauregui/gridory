import { CountryFlag, findCountryByDialCode, getCountryName } from "../../../../countries";

const SHARED_DIAL_CODES = ["+1", "+7", "+39", "+44", "+47", "+61", "+64", "+212", "+262", "+358", "+500", "+590", "+599", "+672"];

const SharedDialCodeRow = ({ dialCode }: { dialCode: string }) => {
  const country = findCountryByDialCode(dialCode);
  return (
    <tr className="border-t">
      <td className="px-2 py-1 font-mono">{dialCode}</td>
      <td className="px-2 py-1">
        {country ? (
          <span className="inline-flex items-center gap-2">
            <CountryFlag code={country} />
            {getCountryName(country)}
          </span>
        ) : null}
      </td>
    </tr>
  );
};

// Only gridory/countries: a table that shows countries without loading the selectors.
export const SharedDialCodesTable = () => (
  <div className="min-w-0 overflow-x-auto rounded-gdy-md border p-4">
    <h4 className="text-xs font-medium text-gdy-muted-foreground">Prefijos compartidos (gridory/countries)</h4>
    <table className="mt-3 text-sm">
      <thead>
        <tr><th className="px-2 py-1 text-left">Prefijo</th><th className="px-2 py-1 text-left">País representativo</th></tr>
      </thead>
      <tbody>{SHARED_DIAL_CODES.map((dialCode) => <SharedDialCodeRow key={dialCode} dialCode={dialCode} />)}</tbody>
    </table>
  </div>
);
