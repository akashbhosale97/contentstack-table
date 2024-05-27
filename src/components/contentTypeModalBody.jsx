import { useDispatch, useSelector } from "react-redux";
import { toggleContentTypeFilter } from "../store/slices/tableSlice";


const ContentTypeModalBody = () => {
  const contentTypes = useSelector((state) => state.tableData.filters.contentTypes)
  const dispatch = useDispatch()
  return (
    <div className="content-types">
      {
        contentTypes.map(({ contentType, checked }) => (
          <div key={contentType} className="content-type">
            <input type="checkbox" checked={checked} name={contentType} id={contentType} onChange={() => dispatch(toggleContentTypeFilter({ contentType }))} />
            <label htmlFor={contentType}>{contentType}</label>
          </div>
        ))
      }
    </div>
  )
}
export default ContentTypeModalBody
