import { combineReducers } from 'redux';
import contentTypeSlice from './contentTypeSlice';
import tableDataSlice from './tableSlice';
import publishStatusSlice from './publishStatusSlice';

const rootReducer = combineReducers({
  contentTypes: contentTypeSlice,
  tableData: tableDataSlice,
  publishStatuses: publishStatusSlice,
});

export default rootReducer;
