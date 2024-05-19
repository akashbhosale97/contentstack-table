import { combineReducers } from 'redux';
import tableDataSlice from './tableSlice';

const rootReducer = combineReducers({
  tableData: tableDataSlice,
});

export default rootReducer;
