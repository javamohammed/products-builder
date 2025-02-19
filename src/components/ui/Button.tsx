import {ButtonHTMLAttributes} from "react";

interface IProps  extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    className: string;
    width : 'w-full' | 'w-fit'
}
const Button = ({children, className, width = "w-full", ...rest}:IProps) => {
    return (
        <button className={`${className} p-2 w-full rounded-md text-white ${width} cursor-pointer` } {...rest}>{children}</button>
    );
};

export default Button;