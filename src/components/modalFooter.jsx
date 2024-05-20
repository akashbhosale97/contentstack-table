import { useDispatch } from "react-redux"
import { filterTable } from "../store/slices/tableSlice"

const ModalFooter = ({ setModal }) => {

  const dispatch = useDispatch()
  function handleApply() {
    dispatch(filterTable())
    setModal('')
  }

  return (
    <div className="content-type-modal-footer">
      <button className="btn" onClick={() => setModal('')}>Cancel</button>
      <button className="btn purple-btn" onClick={handleApply}>Apply</button>
    </div>
  )
}

export default ModalFooter
