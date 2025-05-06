import { useMemo } from "react";

const RecordCount = ({ allProperties, start, end, totalCount }) => {
  const getTotalItemsPerPageAvailable = useMemo(() => {
    if (!allProperties) return 0;
    return Math.min(end - start + start, totalCount);
  }, [start, end, allProperties]);

  return (
    <div className="col-12 text-end p-1">
      {getTotalItemsPerPageAvailable} / {totalCount > 0 ? totalCount : ""}{" "}
      Records
    </div>
  );
};

export default RecordCount;
