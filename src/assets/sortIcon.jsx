function SortIcon({ sortType }) {
  const topColor = sortType === 'asc' ? "#000" : "#DDE3EE"
  const bottomColor = sortType === 'asc' ? "#DDE3EE" : "#000"
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="18"
      fill="none"
      viewBox="0 0 11 18"
    >
      <path
        fill={topColor}
        d="M4.894 1.12c.15-.189.437-.189.587 0l4.582 5.772a.375.375 0 01-.293.608H.606a.375.375 0 01-.294-.608L4.894 1.12zM5.481 16.88a.375.375 0 01-.587 0L.312 11.11a.375.375 0 01.294-.609H9.77c.314 0 .489.363.293.608L5.481 16.88z"
      ></path>
      <path
        fill={bottomColor}
        d="M5.481 16.88a.375.375 0 01-.587 0L.312 11.11a.375.375 0 01.294-.609H9.77c.314 0 .489.363.293.608L5.481 16.88z"
      ></path>
    </svg>
  );
}

export default SortIcon;
