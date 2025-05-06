import React from "react";
import { FaArrowUp, FaArrowDown, FaInfoCircle } from "react-icons/fa";

const SortIcon = ({ isSorted, isDesc }) => {
  if (!isSorted) return null;
  return isDesc ? (
    <FaArrowUp size={14} style={{ marginLeft: "6px" }} />
  ) : (
    <FaArrowDown size={14} style={{ marginLeft: "6px" }} />
  );
};

const InfoIcon = ({ show }) => {
  if (!show) return null;
  return (
    <div style={{ display: "inline-block" }}>
      <button
        className=""
        style={{ background: "transparent", border: "none" }}
        title="This column is sortable. Click to sort ascending/descending."
      >
        <FaInfoCircle style={{ fontSize: "14px", color: "#ccc" }} />
      </button>
    </div>
  );
};

const SmartTableHeaderCell = ({ headCell, index, sortDesc, sortData }) => {
  const isSorted = Object.prototype.hasOwnProperty.call(sortDesc, headCell.id);
  const isDesc = sortDesc[headCell.id];

  return (
    <th
      id={headCell.id}
      key={headCell.id}
      scope="col"
      style={{
        width: headCell.width,
        backgroundColor: "#2e008b",
        color: "white",
        position: "sticky",
        top: "0",
        left: index === 0 ? "0" : undefined,
        zIndex: index === 0 ? "3" : "2",
        paddingRight: "8px",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
      className={headCell.sortable !== false ? "smartTable-pointer" : ""}
      onClick={() =>
        headCell.sortable !== false && headCell.id !== "address"
          ? sortData(headCell.id)
          : null
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // gap: "2px",  
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <InfoIcon show={headCell.sortable !== false} />
          {headCell.label}
        </span>
        <SortIcon isSorted={isSorted} isDesc={isDesc} />
      </div>
    </th>
  );
};

export default SmartTableHeaderCell;
