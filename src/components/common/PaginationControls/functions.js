export const extractTextContent = (cellValue) => {
  if (typeof cellValue === "number") {
    return cellValue;
  } else if (typeof cellValue === "object" && cellValue.$$typeof) {
    return extractTextContent(cellValue.props.children);
  } else {
    return String(cellValue);
  }
};

export const extractTextContentFromDate = (value) => {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }
  return date;
};

export const extractNumericValue = (str) => {
  const numericStr = str.replace(/[^0-9]/g, "");
  const numericValue = parseInt(numericStr, 10);

  return numericValue;
};

export const sortTheDataList = (dataList, sortDesc) => {
  const [key] = Object.keys(sortDesc);
  if (!key) return dataList;

  const isDescending = sortDesc[key];
  const tempData = [...dataList];

  const urgencyOrder = { rush: 2, regular: 1 };

  return tempData.sort((a, b) => {
    let valueA = a[key];
    let valueB = b[key];

    if (key === "status") {
      valueA = extractTextContent(valueA)?.toLowerCase() ?? "";
      valueB = extractTextContent(valueB)?.toLowerCase() ?? "";
    } else if (key === "urgency") {
      valueA = urgencyOrder[valueA?.toLowerCase()] ?? 0;
      valueB = urgencyOrder[valueB?.toLowerCase()] ?? 0;
    } else if (key === "order_id") {
      valueA = parseInt(valueA, 10);
      valueB = parseInt(valueB, 10);
    }

    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    if (valueA < valueB) return isDescending ? 1 : -1;
    if (valueA > valueB) return isDescending ? -1 : 1;
    return 0;
  });
};

export const sortData = (cell, sortDesc, setSortDesc) => {
  const isSameKey = sortDesc.hasOwnProperty(cell);
  const newSortDesc = isSameKey
    ? { [cell]: !sortDesc[cell] }
    : { [cell]: false };
  setSortDesc(newSortDesc);
};
