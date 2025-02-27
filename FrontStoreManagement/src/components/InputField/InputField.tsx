import React, { ChangeEvent } from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
  type?: "text" | "password" | "email" | "textarea" | "number";
  nameAndId: string;
  textLabel: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  divClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  nameAndId,
  textLabel,
  value,
  onChange,
  className = "",
  divClassName = "",
}) => {
  const [focused, setFocused] = React.useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <div
      className={`${
        type !== "textarea" ? styles.divInput : styles.divTextarea
      } ${divClassName}`}
    >
      {type !== "textarea" ? (
        <input
          onFocus={handleFocus}
          type={type}
          name={nameAndId}
          id={nameAndId}
          placeholder=""
          value={value}
          onChange={onChange}
          className={`${styles.input} ${className}`}
        />
      ) : (
        <textarea
          name={nameAndId}
          id={nameAndId}
          placeholder=""
          value={value}
          onChange={onChange}
          className={`${styles.input} ${className}`}
        />
      )}
      <label
        className={`${styles.label} ${focused ? styles.focused : ""}`}
        htmlFor={nameAndId}
      >
        {textLabel}
      </label>
    </div>
  );
};

export default InputField;
