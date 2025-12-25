import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from 'react-icons/fa'
import axios from 'axios'
import { serverUrl } from '../App'
import { setMyShopData } from '../redux/ownerSlice'
import { ClipLoader } from 'react-spinners'
import { categories } from '../category'

// Map descriptive labels to backend enum values. Adjust mappings as needed.


const displayToEnum = {
     'Festive Special': 'Festive Special',
    'Combo Special': 'Combo Special',
    'Chef Special': 'Chef Special',
    'Breakfast': 'Breakfast',
    'Lunch': 'Lunch',
    'Dinner': 'Dinner',
    'Snacks': 'Snacks',
    'Sweets': 'Sweets',
    'Non-Veg Dishes': 'Non-Veg Dishes',
    'Beverages': 'Beverages',
    'Diet Food': 'Diet Food',
    'Add-Ons': 'Add-Ons',
    'All': 'All'
}

function AddItem() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { myShopData } = useSelector((state) => state.owner)

    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState('veg')

    const handleImage = (e) => {
        const file = e.target.files && e.target.files[0]
        if (!file) return
        setBackendImage(file)
        try {
            setFrontendImage(URL.createObjectURL(file))
        } catch (e) {
            setFrontendImage(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErr("")

        // Basic validation
        if (!name?.trim() || !category || !foodType || !price) {
            setErr('Please provide name, price, category and food type.')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()

            formData.append("name", name.trim());
            formData.append("category", category);
            formData.append("foodType", foodType);
            formData.append("price", String(price));


            if (myShopData && myShopData._id) {
                formData.append('shopId', myShopData._id)
            }

            if (backendImage) {
                formData.append('image', backendImage)
            }

            const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, { withCredentials: true })

            // backend returns the updated shop document
        dispatch(setMyShopData(result.data))
        setLoading(false)

        // show owner the updated shop/items (Home renders OwnerDashboard)
        navigate('/')
            return
        } catch (error) {
            console.error('Add item error:', error)
            const msg = error?.response?.data?.message || error.message || 'Failed to add item'
            setErr(msg)
            setLoading(false)
            return
        }
    }

    return (
        <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
            <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
                    </div>
                    <div className="text-3xl font-extrabold text-gray-900">Add Food</div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Food Name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Food Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={handleImage}
                        />
                        {frontendImage && (
                            <div className="mt-4">
                                <img src={frontendImage} alt="preview" className="w-full h-48 object-cover rounded-lg border" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Category</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                        >
                            <option value="">select Category</option>
                            {categories.map((cate, index) => (
                                    <option value={displayToEnum[cate.category]} key={index}>
                                        {cate.category}
                                    </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Food Type</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            onChange={(e) => setFoodType(e.target.value)}
                            value={foodType}
                        >
                            <option value="veg">veg</option>
                            <option value="non veg">non veg</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color="white" /> : 'Save'}
                    </button>

                    {err && <p className="text-red-500 mt-2">{err}</p>}
                </form>
            </div>
        </div>
    )
}

export default AddItem
