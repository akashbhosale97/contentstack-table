import { createSlice } from '@reduxjs/toolkit';

const publishStatusSlice = createSlice({
  name: 'publishStatus',
  initialState: [
    {
      status: 'published',
      checked: true,
    },
    {
      status: 'draft',
      checked: true,
    },
    {
      status: 'archived',
      checked: true,
    },
  ],
  reducers: {
    addPublishStatus: (state, action) => {
      state.forEach((item) => {
        if (item.status === action.payload.status) {
          item.checked = true;
        }
      });
    },
    removePublishStatus: (state, action) => {
      state.forEach((item) => {
        if (item.status === action.payload.status) {
          item.checked = false;
        }
      });
    },
  },
});

export const { addPublishStatus, removePublishStatus } =
  publishStatusSlice.actions;
export default publishStatusSlice.reducer;
