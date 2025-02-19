import Image from "./Image.tsx";
import Button from "./ui/Button.tsx";
import {IProduct} from "../interfaces";
import {TextSlicer} from "../utils/functions.ts";
import CircleColor from "./CircleColor.tsx";
interface IProps {
    product: IProduct;
    setEditProduct: (product: IProduct) => void;
    openEditModal: () => void;
    openRemoveModal: () => void;
    index: number;
    setIndexProduct: (index: number) => void;
}

const ProductCard = ( {product, setEditProduct, openEditModal, index, setIndexProduct, openRemoveModal}: IProps) => {
    const { imageURL, colors, price, title, description, category} = product
    const roundedColors = colors.map((color) => <CircleColor color={color} key={color} />)

    return (
        <div className="mx-w-sm md:mx-w-lg mx-auto md:mx-0 border rounded-md m-2 p-2 flex flex-col space-y-3">
            <Image  urlImage={imageURL}
                alt="Product Card"
                  className="rounded-md mb-2 w-full lg:object-cover"
            />
            <h3 className="text-lg font-semibold">{TextSlicer(title, 25)}</h3>
            <p className="text-sm text-gray-500 break-words">
                {TextSlicer(description)}
            </p>
            <div className="flex items-center my-4  space-x-2">
                {!colors.length ? <p className="min-h-[20px] ">Not available colors!</p> : roundedColors}
            </div>
            <div className="flex items-center justify-between">
                <span>${price}</span>
                <Image  urlImage={category.imageURL}
                        alt={category.name}
                        className="w-10 h-10 rounded-full object-bottom"
                />
            </div>
            <div className="flex items-center justify-between space-x-2 mt-5">

                <Button className="bg-indigo-700 hover:bg-indigo-800 font-medium" width="w-full"  onClick={()=> {
                    setEditProduct(product)
                    setIndexProduct(index)
                    openEditModal()
                }}>EDIT</ Button>
                <Button className="bg-red-700 hover:bg-red-800 font-medium"  width="w-full" onClick={()=> {
                    setEditProduct(product)
                    setIndexProduct(index)
                    openRemoveModal()
                }} >DELETE</Button>
            </div>
        </div>
    );
};

export default ProductCard;