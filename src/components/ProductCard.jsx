function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg w-full overflow-hidden hover:scale-105 transition flex flex-col">

            <div className="flex justify-center p-4 bg-white">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-contain"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">

                <h2 className="text-sm md:text-lg font-bold">
                    {product.name}
                </h2>

                <div className="flex gap-2 mt-2 text-xs">
                    <span className="border px-2 py-1 rounded">{product.size}</span>
                    <span className="border px-2 py-1 rounded">{product.color}</span>
                </div>

                <p className="text-gray-500 mt-1.5 text-xs md:text-sm">
                    {product.description}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4">
                    <p className="font-bold">Rs.{product.price}</p>

                    <button className="bg-purple-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm hover:bg-purple-800 transition">
                        Add Cart
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ProductCard;