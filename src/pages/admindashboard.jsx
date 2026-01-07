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
        <div className="min-h-screen bg-gray-50">
            {/* Responsive Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center">
                            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Responsive Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 z-30">
                <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`py-3 sm:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap transition-colors ${activeTab === 'products'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Products</span>
                            <span className="xs:hidden">Products</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`py-3 sm:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap transition-colors ${activeTab === 'contacts'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Contact Submissions</span>
                            <span className="xs:hidden">Contacts</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('brochures')}
                            className={`py-3 sm:py-4 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap transition-colors ${activeTab === 'brochures'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Brochures</span>
                            <span className="xs:hidden">Brochures</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Responsive Main Content */}
            <main className="max-w-[1920px] mx-auto py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-4 sm:space-y-6">
                    {message.text && (
                        <div className={`p-3 sm:p-4 rounded-lg shadow-sm text-sm sm:text-base ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <>
                            {!isAddingProduct ? (
                                <div>
                                    <div className="flex justify-end mb-4 sm:mb-6">
                                        <button
                                            onClick={() => setIsAddingProduct(true)}
                                            className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                        >
                                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                            <span className="hidden xs:inline">Add New Product</span>
                                            <span className="xs:hidden">Add New</span>
                                        </button>
                                    </div>

                                    <div className="bg-white shadow-md overflow-hidden rounded-lg">
                                        <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 border-b border-gray-200">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Product List</h3>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your products</p>
                                        </div>
                                        <div className="divide-y divide-gray-200">
                                            <ul className="divide-y divide-gray-100">
                                                {products.length === 0 ? (
                                                    <li className="px-3 py-8 sm:px-4 sm:py-12 text-center text-gray-500 text-sm sm:text-base">No products found.</li>
                                                ) : (
                                                    products.map((product) => (
                                                        <li key={product._id} className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                            <div className="flex items-center flex-1 min-w-0 mr-2 sm:mr-4">
                                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                    {(product.images && product.images.length > 0) || product.image ? (
                                                                        <img
                                                                            src={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image}
                                                                            alt={product.name}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                                                                    )}
                                                                </div>
                                                                <div className="ml-2 sm:ml-3 md:ml-4 min-w-0 flex-1">
                                                                    <p className="text-xs sm:text-sm font-medium text-green-600 truncate">{getStringValue(product.name)}</p>
                                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{getStringValue(product.category)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleEditClick(product)}
                                                                    className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Edit product"
                                                                >
                                                                    <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteModal({
                                                                        isOpen: true,
                                                                        type: 'product',
                                                                        id: product._id,
                                                                        name: getStringValue(product.name)
                                                                    })}
                                                                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete product"
                                                                >
                                                                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
                                <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl mx-auto border border-gray-100">
                                    <div className="px-4 py-5 sm:px-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{editingProduct ? 'Update existing product details' : 'Fill in the details to add a new product'}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsAddingProduct(false);
                                                setEditingProduct(null);
                                                setProductData({ name: '', description: '', category: 'Granule Products', images: null });
                                                setImagePreview(null);
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Product Images
                                            </label>
                                            <div className="mt-1 flex justify-center px-4 py-6 sm:px-6 sm:pt-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors bg-gray-50/30">
                                                <div className="space-y-2 text-center w-full">
                                                    {imagePreview && imagePreview.length > 0 ? (
                                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                                                            {imagePreview.map((preview, index) => (
                                                                <div key={index} className="relative aspect-square group">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Preview ${index}`}
                                                                        className="h-full w-full object-cover rounded-lg shadow-sm border border-gray-200"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const newPreviews = imagePreview.filter((_, i) => i !== index);
                                                                            const newImages = Array.from(productData.images).filter((_, i) => i !== index);
                                                                            setImagePreview(newPreviews);
                                                                            setProductData(prev => ({ ...prev, images: newImages }));
                                                                        }}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
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

                                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsAddingProduct(false);
                                                    setEditingProduct(null);
                                                    setProductData({ name: '', description: '', category: 'Granule Products', images: null });
                                                    setImagePreview(null);
                                                }}
                                                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors order-2 sm:order-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className={`w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''} order-1 sm:order-2`}
                                            >
                                                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {!isAddingProduct && products.length === 0 && (
                                <div className="border-2 border-dashed border-gray-200 rounded-xl h-64 sm:h-96 flex flex-col items-center justify-center mt-4 sm:mt-6 bg-white">
                                    <Package className="h-12 w-12 text-gray-300 mb-3" />
                                    <p className="text-gray-500 text-base sm:text-lg text-center px-4">No products yet. Select "Add New Product" to get started</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Contacts Tab */}
                    {activeTab === 'contacts' && (
                        <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-900">Contact Submissions</h3>
                                <p className="mt-1 text-sm text-gray-500">View and manage contact form submissions from users.</p>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <ul className="divide-y divide-gray-100">
                                    {contacts.length === 0 ? (
                                        <li className="px-4 py-12 text-center text-gray-500">
                                            <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p>No contact submissions found.</p>
                                        </li>
                                    ) : (
                                        contacts.map((contact) => (
                                            <li key={contact._id} className="px-4 py-5 sm:px-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center min-w-0">
                                                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                                                                    <Mail className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <p className="text-sm font-bold text-gray-900 truncate">{getStringValue(contact.name)}</p>
                                                            </div>
                                                            <span className="text-[10px] sm:text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                                                                {contact.createdAt ? formatDate(contact.createdAt) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-xs sm:text-sm text-gray-600 flex items-center">
                                                                <span className="font-semibold mr-2 text-gray-400">Phone:</span>
                                                                <span className="text-gray-900">{getStringValue(contact.phone)}</span>
                                                            </p>
                                                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                                <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Message</p>
                                                                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{getStringValue(contact.message)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end sm:pt-1">
                                                        <button
                                                            onClick={() => setDeleteModal({
                                                                isOpen: true,
                                                                type: 'contact',
                                                                id: contact._id,
                                                                name: getStringValue(contact.name)
                                                            })}
                                                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete submission"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
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
                                    <div className="flex justify-end mb-4 sm:mb-6">
                                        <button
                                            onClick={() => setIsUploadingBrochure(true)}
                                            className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                                        >
                                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                                            <span className="hidden xs:inline">Upload New Brochure</span>
                                            <span className="xs:hidden">Upload</span>
                                        </button>
                                    </div>

                                    <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
                                        <div className="px-4 py-5 sm:px-6 border-b border-gray-100 bg-gray-50/50">
                                            <h3 className="text-lg font-bold text-gray-900">Brochures</h3>
                                            <p className="mt-1 text-sm text-gray-500">Manage PDF brochures for download.</p>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            <ul className="divide-y divide-gray-100">
                                                {brochures.length === 0 ? (
                                                    <li className="px-4 py-12 text-center text-gray-500">
                                                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                        <p>No brochures found.</p>
                                                    </li>
                                                ) : (
                                                    brochures.map((brochure) => (
                                                        <li key={brochure._id} className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                                            <div className="flex items-center flex-1 min-w-0 mr-4">
                                                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                                                                </div>
                                                                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                                                    <p className="text-sm font-bold text-green-600 truncate">
                                                                        {getStringValue(brochure.title) || getStringValue(brochure.filename) || 'Untitled Brochure'}
                                                                    </p>
                                                                    <div className="flex items-center mt-0.5 space-x-2">
                                                                        <span className="text-[10px] sm:text-xs text-gray-400">
                                                                            {brochure.createdAt ? formatDate(brochure.createdAt) : 'N/A'}
                                                                        </span>
                                                                        {brochure.filesize && (
                                                                            <>
                                                                                <span className="text-gray-300">•</span>
                                                                                <span className="text-[10px] sm:text-xs text-gray-400">
                                                                                    {(brochure.filesize / (1024 * 1024)).toFixed(2)} MB
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                                                                <button
                                                                    onClick={() => handleDownloadBrochure(brochure._id, brochure.filename)}
                                                                    className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Download brochure"
                                                                >
                                                                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteModal({
                                                                        isOpen: true,
                                                                        type: 'brochure',
                                                                        id: brochure._id,
                                                                        name: getStringValue(brochure.title) || getStringValue(brochure.filename) || 'Untitled Brochure'
                                                                    })}
                                                                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete brochure"
                                                                >
                                                                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
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
                                <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl mx-auto border border-gray-100">
                                    <div className="px-4 py-5 sm:px-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Upload Brochure</h2>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Add a new PDF brochure for users to download</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setIsUploadingBrochure(false);
                                                setBrochureFile(null);
                                                setBrochureTitle('');
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                                        >
                                            <X className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleBrochureUpload} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Brochure Title (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={brochureTitle}
                                                onChange={(e) => setBrochureTitle(e.target.value)}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                placeholder="Enter brochure title"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                PDF File *
                                            </label>
                                            <div className="mt-1 flex justify-center px-4 py-6 sm:px-6 sm:pt-5 sm:pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors bg-gray-50/30">
                                                <div className="space-y-2 text-center w-full">
                                                    {brochureFile ? (
                                                        <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                                                            <FileText className="h-10 w-10 text-red-600 mr-3 flex-shrink-0" />
                                                            <div className="text-left min-w-0 flex-1">
                                                                <p className="text-sm font-bold text-gray-900 truncate">{brochureFile.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {(brochureFile.size / (1024 * 1024)).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => setBrochureFile(null)}
                                                                className="ml-4 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                                            <div className="flex flex-col text-sm text-gray-600">
                                                                <label
                                                                    htmlFor="brochure-upload"
                                                                    className="relative cursor-pointer bg-white rounded-md font-bold text-green-600 hover:text-green-500 focus-within:outline-none"
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
                                                                <p className="mt-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs text-gray-400">
                                                                PDF files only, up to 10MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUploadingBrochure(false);
                                                    setBrochureFile(null);
                                                    setBrochureTitle('');
                                                }}
                                                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors order-2 sm:order-1"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading || !brochureFile}
                                                className={`w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${loading || !brochureFile ? 'opacity-75 cursor-not-allowed' : ''} order-1 sm:order-2`}
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
