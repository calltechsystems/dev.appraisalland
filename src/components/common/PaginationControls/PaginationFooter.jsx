import React, { useState } from "react";

const Pagination = ({
  setStart,
  setEnd,
  properties,
  filteredPropertiesCount,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const propertiesPerPage = process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || 20;

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const pageNumbers = [];
  const totalPages = Math.ceil(filteredPropertiesCount / propertiesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const updateDisplayedProperties = (page) => {
    const indexOfLastProperty = page * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    setStart(1);
    setEnd(indexOfLastProperty);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    updateDisplayedProperties(pageNumber);
  };
  
  return (
    <div>
      {filteredPropertiesCount >= propertiesPerPage ? (
        <ul className="page_navigation">
          {/* Previous page button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              tabIndex="-1"
              aria-disabled={currentPage === 1 ? true : false}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="flaticon-left-arrow"></span>
            </a>
          </li>

          {/* Page numbers */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => handlePageChange(number)}
              >
                {number}
                {currentPage === number && (
                  <span className="sr-only">(current)</span>
                )}
              </a>
            </li>
          ))}

          <li
            className={`page-item ${
              currentPage === pageNumbers.length ? "disabled" : ""
            }`}
          >
            <a
              className="page-link"
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="flaticon-right-arrow"></span>
            </a>
          </li>
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default Pagination;
