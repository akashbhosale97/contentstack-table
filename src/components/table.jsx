import clsx from "clsx";
import { TABLE_HEADERS } from '../constants';
import { alignText, displayFilter } from "../utils";
import FilterIcon from "../assets/filterIcon";
import { useState, useRef, useCallback } from "react";
import ModalWrapper from "./modalWrapper";
import ContentTypeModalBody from "./contentTypeModalBody";
import DeleteIcon from "../assets/deleteIcon";
import ModalFooter from "./modalFooter";
import { useDispatch, useSelector } from "react-redux";
import PublishStatusModalBody from "./publishStatusModalBody";
import { deleteRow, sortTableContentTypes } from "../store/slices/tableSlice";
import SortIcon from "../assets/sortIcon";
import ModifiedAtModalBody from "./modifiedAtModalBody";
import Pagination from "./pagination";

const Table = () => {
  const dispatch = useDispatch();
  const { filteredData: tableData } = useSelector((state) => state.tableData);
  const { sortOrder } = useSelector((state) => state.tableData);
  const [numberOfRows, setNumberOfRows] = useState(10);
  const [modal, setModal] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openModal, setOpenModal] = useState(false)
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
    let newWidth = startWidth + (e.clientX - startX);
    if (newWidth > 500) {
      newWidth = 500;
    }
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

  const renderModal = useCallback(() => {
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
  }, [modal]);

  const renderCell = (header, item) => {
    if (header === 'id') {
      return (
        <input
          type="checkbox"
          checked={selectedRows.includes(item.id)}
          onChange={(e) => handleSelectRow(e, item.id)}
        />
      );
    } else if (header === 'actions') {
      return (
        <button className="delete-btn" onClick={() => dispatch(deleteRow({ id: item.id }))}>
          <DeleteIcon /> Delete
        </button>
      );
    }
    else if (header === 'taxonomies' || header === 'tags') {
      return item[header].join(', ')
    }
    else {
      return item[header];
    }
  };

  const renderHeader = (header, sort) => {
    if (header === 'id') {
      return <input
        type="checkbox"
        checked={allSelected}
        onChange={handleSelectAll}
      />
    } else {
      return <div className="flex">
        {sort ? <>{header}{<button className="sort-icon" onClick={() => dispatch(sortTableContentTypes())}><SortIcon sortType={sortOrder} /></button>}</> : header}
        {displayFilter(header) && (
          <div className="relative">
            <FilterIcon onClick={() => {
              setModal(header)
              setOpenModal(!openModal)
            }} />
            {modal === header && openModal && (
              <div className="absolute-modal">
                {renderModal()}
              </div>
            )}
          </div>
        )}
      </div>
    }
  }

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
                  {renderHeader(header, sort)}
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
                    {renderCell(header, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination tableData={tableData} currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfRows={numberOfRows} setNumberOfRows={setNumberOfRows} numberOfPages={numberOfPages} />
    </div>
  );
};

export default Table;
