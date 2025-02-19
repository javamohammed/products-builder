
interface IProps {
    urlImage: string;
    alt: string;
    className: string;
}
const Image = ({urlImage, alt, className}:IProps) => {
    return (
        <img
            src={urlImage}
            alt={alt}
            className={className}
        />
    );
};

export default Image;