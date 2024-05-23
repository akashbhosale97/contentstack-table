import RightExtremeIcon from "../assets/rightExtremeIcon";
import LeftExtremeIcon from "../assets/leftExtremeIcon";
import LeftArrowIcon from "../assets/leftArrowIcon";
import RightArrowIcon from "../assets/rightArrowIcon";

const Pagination = ({ tableData, currentPage, setCurrentPage, numberOfRows, setNumberOfRows, numberOfPages }) => {
  return (
    <div className="pagination">
      <div className="pagination-left">
        Showing<select
          onChange={(e) => {
            const value = parseInt(e.target.value);
            let validRows = value;
            if (value > tableData.length) {
              validRows = Math.ceil(tableData.length / 10) * 10;
            }
            setNumberOfRows(validRows);
            setCurrentPage(1);
          }}
          value={numberOfRows}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        of {tableData.length} records
      </div>
      <div className="pagination-right">
        <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
          <LeftExtremeIcon />
        </button>
        <button className="pagination-btn" disabled={currentPage === 1} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>
          <LeftArrowIcon />
        </button>
        <select
          onChange={(e) => {
            setCurrentPage(parseInt(e.target.value));
          }}
          value={currentPage}
        >
          {Array.from({ length: numberOfPages }).map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <button className="pagination-btn" disabled={currentPage >= numberOfPages} onClick={() => currentPage < numberOfPages && setCurrentPage(currentPage + 1)}>
          <RightArrowIcon />
        </button>
        <button className="pagination-btn" disabled={currentPage >= numberOfPages} onClick={() => setCurrentPage(numberOfPages)}>
          <RightExtremeIcon />
        </button>
      </div>
    </div>
  )
}

export default Pagination
