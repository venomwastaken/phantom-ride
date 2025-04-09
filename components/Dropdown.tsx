import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "@/app/book/bs.module.css"

type DropdowmProps = {
  placeholder: string;
  value?: string;
  onChangeHandler?: () => void;
  items: string[];
  disabled?: boolean;
};

const Dropdown = ({ value, onChangeHandler, items, placeholder, disabled}: DropdowmProps) => {
  return (
    <Select onValueChange={onChangeHandler} value={value}>
      <SelectTrigger className={`${styles.select} input dropdown` } disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map(item => (<SelectItem value={item} key={item}>{item}</SelectItem>))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
