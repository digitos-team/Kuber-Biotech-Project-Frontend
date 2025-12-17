import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Upload, X, Trash2, Edit, Mail, Package } from 'lucide-react';
import { addProduct, getAllProducts, deleteProduct, updateProduct } from '../api/productApi';
import { getAllContacts, deleteContact } from '../api/contactApi';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [products, setProducts] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Granule Products',
        images: []
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Helper function to safely extract string values from multilingual objects
    const getStringValue = (value) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            // If it's an object with language keys like {en: "...", mr: "..."}
            return value.en || value.mr || Object.values(value)[0] || '';
        }
        return String(value);
    };

    useEffect(() => {
        fetchProducts();
        fetchContacts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts();
            console.log("Products API response:", response);

            let productsList = [];
            const responseData = response.data?.data || response.data;

            if (Array.isArray(responseData)) {
                const innerArray = responseData.find(item => Array.isArray(item));
                if (innerArray) {
                    productsList = innerArray;
                } else {
                    productsList = responseData;
                }
            } else if (responseData?.products) {
                productsList = responseData.products;
            }

            const validProducts = Array.isArray(productsList)
                ? productsList.filter(item => item && typeof item === 'object')
                : [];

            setProducts(validProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await getAllContacts();
            console.log("Contacts API response:", response);

            let contactsList = [];
            const responseData = response.data?.data || response.data;

            if (Array.isArray(responseData)) {
                contactsList = responseData;
            } else if (responseData?.contacts) {
                contactsList = responseData.contacts;
            }

            const validContacts = Array.isArray(contactsList)
                ? contactsList.filter(item => item && typeof item === 'object')
                : [];

            setContacts(validContacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const handleLogout = () => {
        navigate('/admin');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setProductData(prev => ({ ...prev, images: files }));

            const newPreviews = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === files.length) {
                        setImagePreview(newPreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (editingProduct) {
                // For editing, send JSON data (backend doesn't accept FormData for edit)
                const updateData = {
                    newname: productData.name,
                    newdescription: productData.description,
                    newprice: productData.price,
                    newcategory: productData.category
                };
                await updateProduct(editingProduct._id, updateData);
                setMessage({ type: 'success', text: 'Product updated successfully!' });
            } else {
                // For adding, send FormData (backend expects multipart/form-data)
                const formData = new FormData();
                formData.append('name', productData.name);
                formData.append('description', productData.description);
                formData.append('price', productData.price);
                formData.append('category', productData.category);

                if (productData.images && productData.images.length > 0) {
                    productData.images.forEach(file => {
                        formData.append('images', file);
                    });
                }

                await addProduct(formData);
                setMessage({ type: 'success', text: 'Product added successfully!' });
            }
            setProductData({ name: '', description: '', price: '', category: 'Granule Products', images: null });
            setImagePreview(null);
            setEditingProduct(null);
            setIsAddingProduct(false);
            fetchProducts();
        } catch (error) {
            console.error("Error saving product:", error);
            setMessage({ type: 'error', text: `Failed to ${editingProduct ? 'update' : 'add'} product. Please try again.` });
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setProductData({
            name: getStringValue(product.name),
            description: getStringValue(product.description),
            price: getStringValue(product.price),
            category: getStringValue(product.category) || 'Granule Products',
            images: []
        });

        if (product.images && product.images.length > 0) {
            setImagePreview(product.images);
        } else if (product.image) {
            setImagePreview([product.image]);
        } else {
            setImagePreview(null);
        }

        setIsAddingProduct(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(productId);
                setMessage({ type: 'success', text: 'Product deleted successfully!' });
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                setMessage({ type: 'error', text: 'Failed to delete product.' });
            }
        }
    };

    const handleDeleteContact = async (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact submission?")) {
            try {
                await deleteContact(contactId);
                setMessage({ type: 'success', text: 'Contact submission deleted successfully!' });
                fetchContacts();
            } catch (error) {
                console.error("Error deleting contact:", error);
                setMessage({ type: 'error', text: 'Failed to delete contact submission.' });
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'products'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Package className="h-5 w-5 mr-2" />
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'contacts'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Mail className="h-5 w-5 mr-2" />
                            Contact Submissions
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {message.text && (
                        <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <>
                            {!isAddingProduct ? (
                                <div>
                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={() => setIsAddingProduct(true)}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Add New Product
                                        </button>
                                    </div>

                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Product List</h3>
                                        </div>
                                        <div className="border-t border-gray-200">
                                            <ul className="divide-y divide-gray-200">
                                                {products.length === 0 ? (
                                                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No products found.</li>
                                                ) : (
                                                    products.map((product) => (
                                                        <li key={product._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                                            <div className="flex items-center">
                                                                <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                                                    {(product.images && product.images.length > 0) || product.image ? (
                                                                        <img
                                                                            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                                                            alt={product.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <Upload className="h-6 w-6 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <p className="text-sm font-medium text-green-600">{getStringValue(product.name)}</p>
                                                                    <p className="text-sm text-gray-500">₹{getStringValue(product.price)}</p>
                                                                    <p className="text-xs text-gray-400">{getStringValue(product.category)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleEditClick(product)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                >
                                                                    <Edit className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteProduct(product._id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                        <button
                                            onClick={() => {
                                                setIsAddingProduct(false);
                                                setEditingProduct(null);
                                                setProductData({ name: '', description: '', price: '', category: 'Granule Products', images: null });
                                                setImagePreview(null);
                                            }}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={productData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                placeholder="Enter product name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={productData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                placeholder="Enter product description"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Price
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={productData.price}
                                                    onChange={handleInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                                Category
                                            </label>
                                            <select
                                                name="category"
                                                id="category"
                                                required
                                                value={productData.category}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            >
                                                <option value="Granule Products">Granule Products</option>
                                                <option value="Liquid Products">Liquid Products</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Images
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
                                                <div className="space-y-1 text-center">
                                                    {imagePreview && imagePreview.length > 0 ? (
                                                        <div className="grid grid-cols-3 gap-4">
                                                            {imagePreview.map((preview, index) => (
                                                                <div key={index} className="relative inline-block">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Preview ${index}`}
                                                                        className="h-24 w-24 object-cover rounded-md"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newPreviews = imagePreview.filter((_, i) => i !== index);
                                                                            const newImages = Array.from(productData.images).filter((_, i) => i !== index);
                                                                            setImagePreview(newPreviews);
                                                                            setProductData(prev => ({ ...prev, images: newImages }));
                                                                        }}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                            <div className="flex text-sm text-gray-600 justify-center">
                                                                <label
                                                                    htmlFor="file-upload"
                                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                                                >
                                                                    <span>Upload files</span>
                                                                    <input
                                                                        id="file-upload"
                                                                        name="file-upload"
                                                                        type="file"
                                                                        className="sr-only"
                                                                        accept="image/*"
                                                                        multiple
                                                                        onChange={handleImageChange}
                                                                        required={!productData.images || productData.images.length === 0}
                                                                    />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                PNG, JPG, GIF up to 10MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsAddingProduct(false);
                                                    setEditingProduct(null);
                                                    setProductData({ name: '', description: '', price: '', category: 'Granule Products', images: null });
                                                    setImagePreview(null);
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            >
                                                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {!isAddingProduct && products.length === 0 && (
                                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center mt-6">
                                    <p className="text-gray-500 text-lg">No products yet. Select "Add New Product" to get started</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Contacts Tab */}
                    {activeTab === 'contacts' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Submissions</h3>
                                <p className="mt-1 text-sm text-gray-500">View and manage contact form submissions from users.</p>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {contacts.length === 0 ? (
                                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No contact submissions found.</li>
                                    ) : (
                                        contacts.map((contact) => (
                                            <li key={contact._id} className="px-4 py-6 sm:px-6 hover:bg-gray-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center">
                                                                <Mail className="h-5 w-5 text-green-600 mr-2" />
                                                                <p className="text-sm font-semibold text-gray-900">{getStringValue(contact.name)}</p>
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {contact.createdAt ? formatDate(contact.createdAt) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Email:</span> {getStringValue(contact.email)}
                                                        </p>
                                                        <div className="bg-gray-50 p-3 rounded-md">
                                                            <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{getStringValue(contact.message)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteContact(contact._id)}
                                                        className="ml-4 text-red-600 hover:text-red-900 flex-shrink-0"
                                                        title="Delete submission"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
