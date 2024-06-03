export default function CustomTooltip({ active, payload, label, e }) {
  if (active && payload && payload.length) {
    return (
      // <div className="w-96 h-96 relative overflow-y-auto">
      <div className="bg-white relative rounded-md p-2 h-auto shadow-lg z-50 overflow-y-scroll text-sm">
        <p className="font-bold">{`Barangay: ${label}`}</p>
        <p>
          Total Cases:{" "}
          <span className="font-bold">{payload[0].payload.total_cases}</span>
        </p>
        {payload[0].payload.offenses.map((data) => (
          <div className="border-b-1 border-slate-200 ps-2">
            <p>
              <span className="font-semibold">Offence:</span> {data.offense} (
              <span className="font-bold">6</span> cases)
            </p>
          </div>
        ))}
      </div>

      // </div>
    );
  }

  return null;
}

export function CustomTooltip2({ active, payload, label, e }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white relative rounded-md p-2 h-auto shadow-lg z-50 overflow-y-scroll text-sm">
        <p className="font-bold">{`Barangay: ${label}`}</p>
        <p>
          Total Cases:{" "}
          <span className="font-bold">{payload[0].payload.total_cases}</span>
        </p>
        {payload[0].payload.offenses &&
          Object.entries(payload[0].payload.offenses).map(
            ([offense, count]) => (
              <div className="border-b-1 border-slate-200 ps-2">
                <p>
                  <span className="font-semibold">Offence:</span> {offense} (
                  <span className="font-bold">{count}</span> cases)
                </p>
              </div>
            )
          )}
      </div>
    );
  }

  return null;
}
