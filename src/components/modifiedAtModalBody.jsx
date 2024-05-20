import { useDispatch, useSelector } from "react-redux";
import { setModifiedAt } from "../store/slices/tableSlice";

const ModifiedAtModalBody = () => {
  const { from, to } = useSelector((state) => state.tableData.filters.modifiedAt);
  const dispatch = useDispatch();

  const handleFromDateChange = (e) => {
    const fromDate = e.target.value
    dispatch(setModifiedAt({ from: fromDate, to }));
  };

  const handleToDateChange = (e) => {
    const toDate = e.target.value
    dispatch(setModifiedAt({ from, to: toDate }));
  };

  return (
    <div className="modified-at-modal-body">
      <div className="date-container">
        From
        <input type="date" value={from} onChange={handleFromDateChange} />
      </div>
      <div className="date-container">
        To
        <input type="date" value={to} onChange={handleToDateChange} />
      </div>
    </div>
  );
};

export default ModifiedAtModalBody;
