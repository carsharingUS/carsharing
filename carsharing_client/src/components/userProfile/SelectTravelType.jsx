import React, { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const SelectTravelType = ({ onSelect }) => {
  const [selectedType, setSelectedType] = useState("host");

  const handleSelection = (event) => {
    setSelectedType(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <FormControl>
      <RadioGroup
        row
        aria-label="travel type"
        name="travel-type"
        value={selectedType}
        onChange={handleSelection}
        style={{ display: "flex", justifyContent: "center", gap: "20px" }}
      >
        <FormControlLabel value="host" control={<Radio />} label="Host" />
        <FormControlLabel value="passenger" control={<Radio />} label="Passenger" />
      </RadioGroup>
    </FormControl>
  );
};

export default SelectTravelType;
