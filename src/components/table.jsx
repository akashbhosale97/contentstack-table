import clsx from "clsx";
import { TABLE_HEADERS } from '../constants';
import { alignText, displayFilter } from "../utils";
import FilterIcon from "../assets/filterIcon";
import { useState, useRef } from "react";
import ModalWrapper from "./modalWrapper";
import ContentTypeModalBody from "./contentTypeModalBody";
import DeleteIcon from "../assets/deleteIcon";
import RightExtremeIcon from "../assets/rightExtremeIcon";
import LeftExtremeIcon from "../assets/leftExtremeIcon";
import LeftArrowIcon from "../assets/leftArrowIcon";
import RightArrowIcon from "../assets/rightArrowIcon";
import ModalFooter from "./modalFooter";
import { useDispatch, useSelector } from "react-redux";
import PublishStatusModalBody from "./publishStatusModalBody";
import { deleteRow, sortTableContentTypes } from "../store/slices/tableSlice";
import SortIcon from "../assets/sortIcon";
import ModifiedAtModalBody from "./modifiedAtModalBody";

const Table = () => {
  const dispatch = useDispatch();
  const { filteredData: tableData } = useSelector((state) => state.tableData);
  const { sortOrder } = useSelector((state) => state.tableData);
  const [numberOfRows, setNumberOfRows] = useState(10);
  const [modal, setModal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const numberOfPages = Math.ceil(tableData.length / numberOfRows);
  const currentPageRows = tableData.slice((currentPage - 1) * numberOfRows, currentPage * numberOfRows);
  const allSelected = selectedRows.length === tableData.length;

  const [columnWidths, setColumnWidths] = useState(TABLE_HEADERS.reduce((acc, { header, width }) => {
    acc[header] = width || 150;
    return acc;
  }, {}));
  const [originalWidths] = useState(TABLE_HEADERS.reduce((acc, { header, width }) => {
    acc[header] = width || 150;
    return acc;
  }, {}));

  const resizingRef = useRef({ isResizing: false, column: null, startX: 0, startWidth: 0 });

  const handleMouseDown = (header, e) => {
    resizingRef.current = {
      isResizing: true,
      column: header,
      startX: e.clientX,
      startWidth: columnWidths[header],
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    if (!resizingRef.current.isResizing) return;
    const { startX, startWidth, column } = resizingRef.current;
    const newWidth = startWidth + (e.clientX - startX);
    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [column]: newWidth > originalWidths[column] ? newWidth : originalWidths[column],
    }));
  };

  const handleMouseUp = () => {
    resizingRef.current.isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(tableData.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (e, id) => {
    if (e.target.checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    }
  };

  const renderModal = () => {
    switch (modal) {
      case 'content type':
        return (
          <ModalWrapper header={modal} body={<ContentTypeModalBody />} onClose={() => setModal('')} footer={<ModalFooter setModal={setModal} />} />
        );
      case 'publish status':
        return (
          <ModalWrapper header={modal} body={<PublishStatusModalBody />} onClose={() => setModal('')} footer={<ModalFooter setModal={setModal} />} />
        );
      case 'modified at':
        return (
          <ModalWrapper header={modal} body={<ModifiedAtModalBody />} footer={<ModalFooter setModal={setModal} />} onClose={() => setModal('')} />
        );
    }
  };

  return (
    <div className="table-container">
      <div className="table-top">
        <table>
          <thead>
            <tr>
              {TABLE_HEADERS.map(({ header, sort }) => (
                <th
                  style={{
                    width: columnWidths[header],
                  }}
                  key={header} className={clsx(header === 'id' ? 'left-sticky' : '', header === 'actions' ? 'right-sticky' : '')}>
                  {header === 'id' ? (
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                    />
                  ) : (
                    <div className="flex">
                      {sort ? <>{header}{<button className="sort-icon" onClick={() => dispatch(sortTableContentTypes())}><SortIcon sortType={sortOrder} /></button>}</> : header}
                      {displayFilter(header) && (
                        <div className="relative">
                          <FilterIcon onClick={() => setModal(header)} />
                          {modal === header && (
                            <div className="absolute-modal">
                              {renderModal()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="resize" onMouseDown={(e) => handleMouseDown(header, e)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentPageRows.map((item) => (
              <tr key={item.id}>
                {TABLE_HEADERS.map(({ header }) => (
                  <td
                    key={header}
                    className={clsx(header === 'id' ? 'left-sticky' : '', header === 'actions' ? 'right-sticky' : '', alignText(header))}
                  >
                    {header === 'id' ? (
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={(e) => handleSelectRow(e, item.id)}
                      />
                    ) : header === 'actions' ? (
                      <button className="delete-btn" onClick={() => dispatch(deleteRow({ id: item.id }))}>
                        <DeleteIcon /> Delete
                      </button>
                    ) : (
                      item[header]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    </div>
  );
};

export default Table;
