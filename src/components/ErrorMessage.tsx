
interface IProps  {
    msg: string;
}
const ErrorMessage = ({msg}:IProps) => {
    return (
        msg ? <span className="block text-red-700 font-semiold text-sm">{msg}</span> : null
    );
};

export default ErrorMessage;