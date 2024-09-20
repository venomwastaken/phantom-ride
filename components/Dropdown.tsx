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
};

const Dropdown = ({ value, onChangeHandler, items, placeholder,}: DropdowmProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className={`${styles.select} input dropdown`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map(item => (<SelectItem value={item} key={item}>{item}</SelectItem>))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
