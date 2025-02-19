import ProductCard from "./components/ProductCard.tsx";
import {categories, colors, formInputsList, productList} from "./data";
import { v4 as uuid } from "uuid";
import Modal from "./components/ui/Modal.tsx";
import {ChangeEvent, FormEvent, useState} from "react";
import Button from "./components/ui/Button.tsx";
import Input from "./components/ui/Input.tsx";
import {ICategory, IProduct} from "./interfaces";
import {validationProduct} from "./validationProduct";
import ErrorMessage from "./components/ErrorMessage.tsx";
import CircleColor from "./components/CircleColor.tsx";
import Select from "./components/ui/Select.tsx";
import {TypeProductName} from "./Types";

function App() {
    const defaultProduct = {
        title: "",
        description: "",
        price: "",
        imageURL: "",
        colors: [],
        category:{
            name: "",
            imageURL: ""
        }
    }
    const [listProducts, SetListProducts] = useState<IProduct[]>(productList)
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenEditModal, setIsOpenEditModal] = useState(false)
    const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false)
    const [product, setProduct] = useState<IProduct>(defaultProduct)
    const [errors, setErrors] = useState({  title: "",
        description: "",
        price: "",
        imageURL: "",
        colors: ""})
    const [tmpColors, setTmpColors] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<ICategory>(categories[0])
    const [editProduct, setEditProduct] = useState<IProduct>(defaultProduct)
    const [indexProduct, setIndexProduct] = useState<number>(0)
    //console.log(editProduct)
    const  closeModal = () => setIsOpen(false)
    const  openModal = () => setIsOpen(true)

    const  closeEditModal = () => setIsOpenEditModal(false)
    const  openEditModal = () => setIsOpenEditModal(true)

    const  closeRemoveModal = () => setIsOpenRemoveModal(false)
    const  openRemoveModal = () => setIsOpenRemoveModal(true)

    const onCancel = () => {
        setProduct(defaultProduct)
        closeModal()
    }
    const onCancelRemove = () => {

        setProduct(defaultProduct)
        closeRemoveModal()
    }
    /* ------ Handler -------- */

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        setProduct({
            ...product,
            [name]: value,
        })
        setErrors({
            ...errors,
            [name]: "",
        })

    }
    const onChangeEditHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target;
        setEditProduct({
            ...editProduct,
            [name]: value,
        })
        setErrors({
            ...errors,
            [name]: "",
        })

    }



    /* --- RENDER --- */
    const  formInputs = formInputsList.map( input => {
        return <div className="flex flex-col" key={input.id}>
            <label htmlFor={input.id} className="mb-[1px] text-sm font-meduim text-gray-800">{input.label}</label>
            <Input type={input.type} name={input.name} id={input.id} value={product[input.name]} onChange={onChangeHandler}  />
            <ErrorMessage msg={errors[input.name]} />
        </div>
    })
    const renderProductEditWithMsgError = (id: string, label: string, name: TypeProductName ) => {
        return (
            <>
                <label htmlFor={id} className="mb-[1px] text-sm font-meduim text-gray-800">{label}</label>
                <Input type="text" name={id} id={id} value={editProduct[name]}
                       onChange={onChangeEditHandler}/>
                <ErrorMessage msg={errors[name]}/>
            </>
        )
    }

    const renderProducts = listProducts.map((product, index) => {
        return <>
            <ProductCard product={product} key={product.id}
                         setEditProduct={setEditProduct}
                         openEditModal={openEditModal}
                         openRemoveModal={openRemoveModal}
                        index={index}
                         setIndexProduct={setIndexProduct}/>
        </>
    })
    const colorsOutput = colors.map((color) => <CircleColor color={color} key={color} onClick={() => {
        setErrors({
            ...errors,
            colors: "",
        })
        if (tmpColors.includes(color)){
            setTmpColors(prev => prev.filter(item => item != color))
            return;
        }
        if (editProduct.colors.includes(color)){
            setTmpColors(prev => prev.filter(item => item != color))
            return;
        }
        setTmpColors(prev => [...prev, color])
    }}/>)
    /*-------------------- SUBMIT -----------------*/
    const submitHandler= (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const validation = validationProduct({title: product.title, description: product.description, price: product.price, imageURL: product.imageURL, colors: tmpColors});
        const hasErrorMsg = Object.values(validation).some(val => val == "") && Object.values(validation).every(val => val == "")
        console.log(hasErrorMsg)
        if(!hasErrorMsg){
            setErrors(validation)
            return;
        }
        SetListProducts(prev => [{...product, colors: tmpColors,  id: uuid(), category:selectedCategory }, ...prev])
        setProduct(defaultProduct)
        setTmpColors([])
        closeModal()
        console.log("Product has been sent.")
    }
    const submitEditHandler= (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const validation = validationProduct({title: editProduct.title, description: editProduct.description, price: editProduct.price, imageURL: editProduct.imageURL, colors: tmpColors});
        const hasErrorMsg = Object.values(validation).some(val => val == "") && Object.values(validation).every(val => val == "")
        //console.log(editProduct)
        if(!hasErrorMsg){
            setErrors(validation)
            return;
        }
        const updatedProducts = [...productList];
        updatedProducts[indexProduct] = {...editProduct, colors:[...tmpColors, ...editProduct.colors]};
        SetListProducts(updatedProducts)
        setEditProduct(defaultProduct)
        setTmpColors([])
        closeEditModal()
        //console.log("Product has been sent.")
    }
    const submitRemoveHandler= (event: FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const updatedProducts = productList.filter(item => item.id != editProduct.id);
        SetListProducts(updatedProducts)
        setEditProduct(defaultProduct)
        setTmpColors([])
        closeRemoveModal()
        console.log("Product has been sent.", editProduct)
    }

    return (
        <main className="container mx-auto">
            <Button className="bg-indigo-700 hover:bg-indigo-800"  width="w-full" onClick={openModal}>Add </Button>
            <div
                className="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2  ">
                {renderProducts}
            </div>
            {/* Add NEW PRODUCT*/}
            <Modal isOpen={isOpen} closeModal={closeModal} title="ADD A NEW PRODUCT " >
                <form className="space-y-3" onSubmit={submitHandler}>
                    {formInputs}
                    <Select  selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
                    <div className="flex items-center flex-wrap space-x-1  ">
                        {colorsOutput}
                        <ErrorMessage msg={errors.colors} />

                    </div>
                    <div className="flex items-center flex-wrap space-x-1  ">
                        {tmpColors.map((color) => (
                            <span style={{backgroundColor: color}}
                                  className="p-1 mr-1 mb-1 text-xs rounded-md text-white" key={color}>{color}</span>
                        ))}
                    </div>


                    <div className="flex items-center justify-between space-x-3">
                        <Button className="bg-indigo-700 hover:bg-indigo-800" width="w-full">Submit</Button>
                        <Button className="bg-gray-400 hover:bg-gray-500" onClick={onCancel}
                                width="w-full">Cancel</Button>
                    </div>
                </form>

            </Modal>
            {/* EDIT PRODUCT*/}
            <Modal isOpen={isOpenEditModal} closeModal={closeEditModal} title="ADD A NEW PRODUCT " >
                <form className="space-y-3" onSubmit={submitEditHandler}>

                    <div className="flex flex-col">
                        {renderProductEditWithMsgError("title", "Product Title", "title")}
                        {renderProductEditWithMsgError("description", "Product Description", "description")}
                        {renderProductEditWithMsgError("imageURL", "Product ImageURL", "imageURL")}
                        {renderProductEditWithMsgError("price", "Product Price", "price")}
                    </div>

                    <Select selectedCategory={editProduct.category} setSelectedCategory={(value) =>{
                        setEditProduct({...editProduct, category:value});
                    }}/>
                    <div className="flex items-center flex-wrap space-x-1  ">
                        {colorsOutput}
                        <ErrorMessage msg={errors.colors}/>

                    </div>
                    <div className="flex items-center flex-wrap space-x-1  ">
                        {tmpColors.concat(editProduct.colors).map((color) => (
                            <span style={{backgroundColor: color}}
                                  className="p-1 mr-1 mb-1 text-xs rounded-md text-white" key={color}>{color}</span>
                        ))}
                    </div>


                    <div className="flex items-center justify-between space-x-3">
                        <Button className="bg-indigo-700 hover:bg-indigo-800" width="w-full">Submit</Button>
                        <Button className="bg-gray-400 hover:bg-gray-500"   onClick={onCancel}
                                width="w-full">Cancel</Button>
                    </div>
                </form>

            </Modal>

            {/* REMOVE PRODUCT*/}
            <Modal isOpen={isOpenRemoveModal} closeModal={closeRemoveModal} title="Are you sure you want to remove this Product from your store ?  " >
                <form className="space-y-3" onSubmit={submitRemoveHandler}>

                    <div className="flex flex-col">
                        <p>
                            {editProduct.description}
                        </p>
                    </div>


                    <div className="flex items-center justify-between space-x-3">
                        <Button className="bg-red-700 hover:bg-red-800" width="w-full">Yes, Remove</Button>
                        <Button className="bg-gray-400 hover:bg-gray-500" onClick={onCancelRemove}
                                width="w-full">Cancel</Button>
                    </div>
                </form>

            </Modal>


        </main>
    )
}

export default App
