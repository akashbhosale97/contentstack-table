import { createSlice } from '@reduxjs/toolkit';
import { getContentTypes } from '../../utils';
import { TABLE_DATA } from '../../constants';

const data = getContentTypes(TABLE_DATA);

const contentTypeSlice = createSlice({
  name: 'contentType',
  initialState: data,
  reducers: {
    addContentTypes: (state, action) => {
      state.forEach((item) => {
        if (item.contentType === action.payload.contentType) {
          item.checked = true;
        }
      });
    },
    removeContentTypes: (state, action) => {
      state.forEach((item) => {
        if (item.contentType === action.payload.contentType) {
          item.checked = false;
        }
      });
    },
  },
});

export const { addContentTypes, removeContentTypes } = contentTypeSlice.actions;
export default contentTypeSlice.reducer;
