import React, { useContext, useEffect, useState } from "react";

import "./filter.styles.css";
import { StorageContext } from "../../contexts/storage.context";
export const FilterComponent = () => {
  const [filter, setFilter] = useState<string>("");

  const { setFilters } = useContext(StorageContext);

  useEffect(() => {
    const filteringDelayTimer = setTimeout(() => {
      setFilters(filter.split(" "));
    }, 500);

    return () => clearTimeout(filteringDelayTimer);
  }, [filter]);

  return (
    <div className="filter-wrapper">
      <input
        spellCheck={false}
        className="filter-input"
        type="text"
        value={filter}
        placeholder="Type hashtag to filter"
        onChange={(e) => setFilter(e.target.value)}
      ></input>
    </div>
  );
};
