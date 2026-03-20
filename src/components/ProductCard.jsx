import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/product/${product.id}`)} className="bg-white rounded-2xl shadow-lg w-full overflow-hidden hover:scale-105 transition flex flex-col gap-4 cursor-pointer">

            <div className="flex justify-center p-4 bg-purple-900" style={{
                backgroundImage: `
      repeating-linear-gradient( rgba(255, 255, 255, 0.88) 0, transparent 0px),
      linear-gradient(to right, rgba(108, 108, 108, 0.56), rgb(249, 247, 251))
    `, backgroundBlendMode: 'overlay'
            }}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                />
            </div>

            <div className="bg-white relative z-10 -mt-8 border px-4
             py-4 rounded-2xl p-4 flex-col flex-1">

                <h2 className="text-sm md:text-lg font-bold">
                    {product.name}
                </h2>

                <div className="flex gap-4 mt-2 text-xs">
                    <span className="border px-2 py-1 rounded">{product.size}</span>
                    <span className="border px-2 py-1 rounded">{product.color}</span>
                </div>

                <p className="text-gray-500 mt-1.5 text-xs md:text-sm">
                    {product.description}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4">
                    <p className="font-bold">Rs.{product.price}</p>

                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-purple-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-2xl text-md hover:bg-purple-800 transition"
                    >
                        Add Cart
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ProductCard;