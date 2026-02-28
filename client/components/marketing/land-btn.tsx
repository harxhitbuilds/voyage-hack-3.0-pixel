import clsx from "clsx";

import React, { ReactNode } from "react";

interface ButtonProps {
  id?: string;
  title: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  containerClass?: string;
}

const Button = ({
  id,
  title,
  rightIcon,
  leftIcon,
  containerClass,
}: ButtonProps) => {
  return (
    <button
      id={id}
      className={clsx(
        "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-5 py-2.5 text-black sm:px-7 sm:py-3",
        containerClass,
      )}
    >
      {leftIcon}

      <div className="font-general relative inline-flex overflow-hidden text-[10px] uppercase sm:text-xs">
        <div className="translate-y-0 skew-y-0 transition duration-700 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-700 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </div>

      {rightIcon}
    </button>
  );
};

export default Button;
