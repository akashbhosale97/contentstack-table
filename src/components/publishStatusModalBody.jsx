import { useDispatch, useSelector } from "react-redux";
import { toggleStatusFilter } from "../store/slices/tableSlice";

const PublishStatusModalBody = () => {
  const publishStatuses = useSelector((state) => state.tableData.filters.statuses)
  const dispatch = useDispatch()
  return (
    <div className="content-types">
      {
        publishStatuses.map(({ status, checked }) => (
          <div key={status} className="publish-status">
            <input type="checkbox" checked={checked} name={status} id={status} onChange={() => dispatch(toggleStatusFilter({ status }))} />
            <label htmlFor={status}>{status}</label>
          </div>
        ))
      }
    </div>
  )
}
export default PublishStatusModalBody
