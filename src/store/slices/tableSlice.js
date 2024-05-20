import { createSlice } from '@reduxjs/toolkit';
import { TABLE_DATA } from '../../constants';
import { getContentTypes } from '../../utils';

const initialState = {
  tableData: TABLE_DATA,
  filters: {
    contentTypes: getContentTypes(TABLE_DATA),
    statuses: [
      {
        status: 'Published',
        checked: true,
      },
      {
        status: 'Draft',
        checked: true,
      },
      {
        status: 'Archived',
        checked: true,
      },
    ],
    modifiedAt: {
      from: '2022-01-01',
      to: new Date().toISOString().split('T')[0],
    },
  },
  filteredData: TABLE_DATA,
  sortOrder: 'asc',
};

const applyFilters = (state) => {
  const { contentTypes, statuses, modifiedAt } = state.filters;

  state.filteredData = state.tableData.filter((row) => {
    const contentTypeMatch = contentTypes.some(
      (ct) => ct.checked && ct.contentType === row['content type']
    );
    const statusMatch = statuses.some(
      (status) => status.checked && status.status === row['publish status']
    );

    const fromDate = new Date(modifiedAt.from);
    const toDate = new Date(modifiedAt.to);
    const modifiedAtDate = new Date(row['modified at']);
    const result = modifiedAtDate >= fromDate && modifiedAtDate <= toDate;
    if (result) {
      return contentTypeMatch && statusMatch;
    }
  });
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    toggleContentTypeFilter: (state, action) => {
      const { contentType } = action.payload;
      state.filters.contentTypes.forEach((item) => {
        if (item.contentType === contentType) {
          item.checked = !item.checked;
        }
      });
    },
    toggleStatusFilter: (state, action) => {
      const { status } = action.payload;
      state.filters.statuses.forEach((item) => {
        if (item.status === status) {
          item.checked = !item.checked;
        }
      });
    },
    toggleModifiedAtFilter: (state, action) => {
      const { modifiedAt } = action.payload;
      if (state.filters.modifiedAt.includes(modifiedAt)) {
        state.filters.modifiedAt = state.filters.modifiedAt.filter(
          (ma) => ma !== modifiedAt
        );
      } else {
        state.filters.modifiedAt.push(modifiedAt);
      }
    },
    filterTable: (state) => {
      applyFilters(state);
    },
    deleteRow: (state, action) => {
      const index = state.filteredData.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.filteredData.splice(index, 1);
      }
    },
    sortTableContentTypes: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      const { sortOrder } = state;
      state.filteredData.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a['title'].localeCompare(b['title']);
        } else {
          return b['title'].localeCompare(a['title']);
        }
      });
    },
    setModifiedAt: (state, action) => {
      const { from, to } = action.payload;
      state.filters.modifiedAt = { from, to };
      console.log(state.filters.modifiedAt);
    },
  },
});

export const {
  toggleContentTypeFilter,
  toggleStatusFilter,
  toggleModifiedAtFilter,
  filterTable,
  deleteRow,
  sortTableContentTypes,
  setModifiedAt,
} = tableSlice.actions;
export default tableSlice.reducer;
