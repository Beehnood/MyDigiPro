import type { ComponentProps } from "react";

type TVariant = "primary" | "secondary" | "danger" | "warning" | "success";

type TButton = ComponentProps<"button"> & {
  variant?: TVariant;
};

export default function Button({ children, variant, style , ...rest }: TButton) {
//   console.log();
  return (
    <button {...rest} style={{ borderRadius:"50px", ...style, ...checkVariant(variant)}} className=" py-1 px-6 m-1 font-extralight">
      {children}
    </button>
  );
}

function checkVariant(variant?: TVariant) {
  if (variant === "primary") {
    return { backgroundColor: "#004bfb", color: "white"};
  } else if (variant === "secondary") {
    return { backgroundColor: "gray", color: "black" };
  } else if (variant === "danger") {
    return { backgroundColor: "#8B0000", color: "white" };
  } else if (variant === "success") {
    return { backgroundColor: "green", color: "white" };
  } else if (variant === "warning") {
    return { backgroundColor: "yellow", color: "white" };
  }
}
