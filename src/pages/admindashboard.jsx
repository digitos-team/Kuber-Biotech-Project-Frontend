import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Upload, X, Trash2, Edit, Mail, Package, FileText, Download } from 'lucide-react';
import { addProduct, getAllProducts, deleteProduct, updateProduct } from '../api/productApi';
import { getAllContacts, deleteContact } from '../api/contactApi';
import { uploadBrochure, getAllBrochures, deleteBrochure, downloadBrochure } from '../api/brochureApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
    const [products, setProducts] = useState([]);
    const [brochures, setBrochures] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [brochureFile, setBrochureFile] = useState(null);
    const [brochureTitle, setBrochureTitle] = useState('');
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        category: 'Granule Products',
        images: []
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: '', name: '' });

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
        Promise.all([
            fetchProducts(),
            fetchContacts(),
            fetchBrochures()
        ]).catch(error => {
            console.error("Error loading dashboard data:", error);
        });
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getAllProducts();

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

    const fetchBrochures = async () => {
        try {
            const response = await getAllBrochures();


            let brochuresList = [];
            const responseData = response.data?.data || response.data;

            if (Array.isArray(responseData)) {
                brochuresList = responseData;
            } else if (responseData?.brochures) {
                brochuresList = responseData.brochures;
            }

            const validBrochures = Array.isArray(brochuresList)
                ? brochuresList.filter(item => item && typeof item === 'object')
                : [];

            setBrochures(validBrochures);
        } catch (error) {
            console.error("Error fetching brochures:", error);
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
                    newcategory: productData.category
                };
                await updateProduct(editingProduct._id, updateData);
                setMessage({ type: 'success', text: 'Product updated successfully!' });
            } else {
                // For adding, send FormData (backend expects multipart/form-data)
                const formData = new FormData();
                formData.append('name', productData.name);
                formData.append('description', productData.description);
                formData.append('category', productData.category);

                if (productData.images && productData.images.length > 0) {
                    productData.images.forEach(file => {
                        formData.append('images', file);
                    });
                }

                await addProduct(formData);
                setMessage({ type: 'success', text: 'Product added successfully!' });
            }
            setProductData({ name: '', description: '', category: 'Granule Products', images: null });
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
        try {
            await deleteProduct(productId);
            setMessage({ type: 'success', text: 'Product deleted successfully!' });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            setMessage({ type: 'error', text: 'Failed to delete product.' });
        }
    };

    const handleDeleteContact = async (contactId) => {
        try {
            await deleteContact(contactId);
            setMessage({ type: 'success', text: 'Contact submission deleted successfully!' });
            fetchContacts();
        } catch (error) {
            console.error("Error deleting contact:", error);
            setMessage({ type: 'error', text: 'Failed to delete contact submission.' });
        }
    };

    const handleBrochureFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate PDF file
            if (file.type !== 'application/pdf') {
                setMessage({ type: 'error', text: 'Please select a PDF file only.' });
                e.target.value = '';
                return;
            }
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be less than 10MB.' });
                e.target.value = '';
                return;
            }
            setBrochureFile(file);
        }
    };

    const handleBrochureUpload = async (e) => {
        e.preventDefault();
        if (!brochureFile) {
            setMessage({ type: 'error', text: 'Please select a PDF file.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('file', brochureFile);
            if (brochureTitle) {
                formData.append('title', brochureTitle);
            }

            await uploadBrochure(formData);
            setMessage({ type: 'success', text: 'Brochure uploaded successfully!' });
            setBrochureFile(null);
            setBrochureTitle('');
            setIsUploadingBrochure(false);
            fetchBrochures();
        } catch (error) {
            console.error("Error uploading brochure:", error);
            setMessage({ type: 'error', text: 'Failed to upload brochure. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBrochure = async (brochureId) => {
        try {
            await deleteBrochure(brochureId);
            setMessage({ type: 'success', text: 'Brochure deleted successfully!' });
            fetchBrochures();
        } catch (error) {
            console.error("Error deleting brochure:", error);
            setMessage({ type: 'error', text: 'Failed to delete brochure.' });
        }
    };

    const handleDownloadBrochure = async (brochureId, filename) => {
        setLoading(true);
        try {
            const response = await downloadBrochure(brochureId);

            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/pdf' })
            );

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename || 'brochure.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setMessage({ type: 'success', text: 'Brochure downloaded successfully!' });
        } catch (error) {
            console.error("Error downloading brochure:", error);
            setMessage({ type: 'error', text: 'Failed to download brochure.' });
        } finally {
            setLoading(false);
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
                        <button
                            onClick={() => setActiveTab('brochures')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'brochures'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileText className="h-5 w-5 mr-2" />
                            Brochures
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
                                                                    onClick={() => setDeleteModal({
                                                                        isOpen: true,
                                                                        type: 'product',
                                                                        id: product._id,
                                                                        name: getStringValue(product.name)
                                                                    })}
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
                                                setProductData({ name: '', description: '', category: 'Granule Products', images: null });
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
                                                    setProductData({ name: '', description: '', category: 'Granule Products', images: null });
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
                                                            <span className="font-medium">Phone:</span> {getStringValue(contact.phone)}
                                                        </p>
                                                        <div className="bg-gray-50 p-3 rounded-md">
                                                            <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{getStringValue(contact.message)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setDeleteModal({
                                                            isOpen: true,
                                                            type: 'contact',
                                                            id: contact._id,
                                                            name: getStringValue(contact.name)
                                                        })}
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

                    {/* Brochures Tab */}
                    {activeTab === 'brochures' && (
                        <>
                            {!isUploadingBrochure ? (
                                <div>
                                    <div className="flex justify-end mb-6">
                                        <button
                                            onClick={() => setIsUploadingBrochure(true)}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            Upload New Brochure
                                        </button>
                                    </div>

                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">Brochures</h3>
                                            <p className="mt-1 text-sm text-gray-500">Manage PDF brochures for download.</p>
                                        </div>
                                        <div className="border-t border-gray-200">
                                            <ul className="divide-y divide-gray-200">
                                                {brochures.length === 0 ? (
                                                    <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No brochures found.</li>
                                                ) : (
                                                    brochures.map((brochure) => (
                                                        <li key={brochure._id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50">
                                                            <div className="flex items-center">
                                                                <div className="h-12 w-12 bg-red-100 rounded-md flex items-center justify-center">
                                                                    <FileText className="h-6 w-6 text-red-600" />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <p className="text-sm font-medium text-green-600">
                                                                        {getStringValue(brochure.title) || getStringValue(brochure.filename) || 'Untitled Brochure'}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {brochure.createdAt ? formatDate(brochure.createdAt) : 'N/A'}
                                                                    </p>
                                                                    {brochure.filesize && (
                                                                        <p className="text-xs text-gray-400">
                                                                            {(brochure.filesize / (1024 * 1024)).toFixed(2)} MB
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleDownloadBrochure(brochure._id, brochure.filename)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Download brochure"
                                                                >
                                                                    <Download className="h-5 w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteModal({
                                                                        isOpen: true,
                                                                        type: 'brochure',
                                                                        id: brochure._id,
                                                                        name: getStringValue(brochure.title) || getStringValue(brochure.filename) || 'Untitled Brochure'
                                                                    })}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Delete brochure"
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
                                        <h2 className="text-2xl font-bold text-gray-900">Upload Brochure</h2>
                                        <button
                                            onClick={() => {
                                                setIsUploadingBrochure(false);
                                                setBrochureFile(null);
                                                setBrochureTitle('');
                                            }}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleBrochureUpload} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Brochure Title (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={brochureTitle}
                                                onChange={(e) => setBrochureTitle(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                placeholder="Enter brochure title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                PDF File *
                                            </label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 transition-colors">
                                                <div className="space-y-1 text-center">
                                                    {brochureFile ? (
                                                        <div className="flex items-center justify-center">
                                                            <FileText className="h-12 w-12 text-red-600 mr-2" />
                                                            <div className="text-left">
                                                                <p className="text-sm font-medium text-gray-900">{brochureFile.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(brochureFile.size / (1024 * 1024)).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setBrochureFile(null)}
                                                                className="ml-4 text-red-600 hover:text-red-900"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                                            <div className="flex text-sm text-gray-600 justify-center">
                                                                <label
                                                                    htmlFor="brochure-upload"
                                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                                                                >
                                                                    <span>Upload PDF file</span>
                                                                    <input
                                                                        id="brochure-upload"
                                                                        name="brochure-upload"
                                                                        type="file"
                                                                        className="sr-only"
                                                                        accept=".pdf,application/pdf"
                                                                        onChange={handleBrochureFileChange}
                                                                        required
                                                                    />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                PDF files only, up to 10MB
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
                                                    setIsUploadingBrochure(false);
                                                    setBrochureFile(null);
                                                    setBrochureTitle('');
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading || !brochureFile}
                                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading || !brochureFile ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            >
                                                {loading ? 'Uploading...' : 'Upload Brochure'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, type: '', id: '', name: '' })}
                onConfirm={() => {
                    if (deleteModal.type === 'product') {
                        handleDeleteProduct(deleteModal.id);
                    } else if (deleteModal.type === 'contact') {
                        handleDeleteContact(deleteModal.id);
                    } else if (deleteModal.type === 'brochure') {
                        handleDeleteBrochure(deleteModal.id);
                    }
                }}
                title={`Delete ${deleteModal.type === 'product' ? 'Product' : deleteModal.type === 'contact' ? 'Contact' : 'Brochure'}`}
                message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
                itemName={deleteModal.name}
            />
        </div>
    );
};

export default AdminDashboard;
