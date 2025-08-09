import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "@/app/book/bs.module.css";
import { cn } from "@/lib/utils";

type DropdowmProps = {
  placeholder: string;
  value?: string;
  onChangeHandler?: (value:any) => void;
  items: string[];
  disabled?: boolean;
  className?: string;
};

const Dropdown = ({
  value,
  onChangeHandler,
  items,
  placeholder,
  disabled,
  className,
}: DropdowmProps) => {
  return (
    <Select onValueChange={onChangeHandler} value={value}>
      <SelectTrigger
        className={cn(`${styles.select} input dropdown`,className)}
        disabled={disabled}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem value={item} key={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
