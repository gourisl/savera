"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, Loader2, Copy, Upload, Image as ImageIcon, Video, CheckCircle2, ChevronDown, Filter, Download, ExternalLink, ChevronLeft, ChevronRight, CheckSquare, Square, Package, Tag, Star, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";
import Link from "next/link";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [filterBestSeller, setFilterBestSeller] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    original_price: "",
    stock: "10",
    sku: "",
    material: "18k Gold Plated Brass",
    colour: "Gold",
    weight: "",
    category_id: "",
    images: [] as string[],
    video_url: "",
    is_featured: false,
    is_new: true,
    is_bestseller: false,
    care_instructions: "Avoid direct contact with perfumes, lotions, and water. Store in a cool, dry place.",
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, filterCategory, filterAvailability, filterFeatured, filterBestSeller]);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  }

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      original_price: "",
      stock: "10",
      sku: "",
      material: "18k Gold Plated Brass",
      colour: "Gold",
      weight: "",
      category_id: categories[0]?.id || "",
      images: ["https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop"],
      video_url: "",
      is_featured: false,
      is_new: true,
      is_bestseller: false,
      care_instructions: "Avoid direct contact with perfumes, lotions, and water.",
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      price: product.price?.toString() || "",
      original_price: product.original_price?.toString() || "",
      stock: product.stock?.toString() || "10",
      sku: product.sku || "",
      material: product.material || "18k Gold Plated",
      colour: product.colour || "Gold",
      weight: product.weight || "",
      category_id: product.category_id || "",
      images: product.images || ["https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop"],
      video_url: product.video_url || "",
      is_featured: !!product.is_featured,
      is_new: !!product.is_new,
      is_bestseller: !!product.is_bestseller,
      care_instructions: product.care_instructions || "",
    });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (product: any) => {
    try {
      const duplicatedName = `${product.name} (Copy)`;
      const duplicatedSlug = `${product.slug}-copy-${Date.now().toString().slice(-4)}`;

      const { error } = await supabase.from("products").insert({
        ...product,
        id: undefined,
        name: duplicatedName,
        slug: duplicatedSlug,
        created_at: undefined,
      });

      if (error) throw error;
      fetchProducts();
    } catch (err: any) {
      alert("Error duplicating product: " + err.message);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, name, slug });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err: any) {
      alert("Upload failed. Falling back to image URL field.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const priceNum = parseFloat(formData.price);
      const originalPriceNum = formData.original_price ? parseFloat(formData.original_price) : null;
      let discountPct = 0;
      if (originalPriceNum && originalPriceNum > priceNum) {
        discountPct = Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
      }

      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        price: priceNum,
        original_price: originalPriceNum,
        discount_percent: discountPct,
        stock: parseInt(formData.stock, 10) || 0,
        sku: formData.sku || `SAV-${Math.floor(1000 + Math.random() * 9000)}`,
        material: formData.material,
        colour: formData.colour,
        weight: formData.weight,
        category_id: formData.category_id || null,
        images: formData.images.length > 0 ? formData.images : ["https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=600&auto=format&fit=crop"],
        video_url: formData.video_url,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        is_bestseller: formData.is_bestseller,
        care_instructions: formData.care_instructions,
      };

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      fetchProducts();
    }
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    const { error } = await supabase.from("products").delete().in("id", selectedIds);
    if (error) alert("Error in bulk delete: " + error.message);
    else {
      setSelectedIds([]);
      fetchProducts();
    }
  };

  const handleBulkUpdate = async (field: string, value: any) => {
    const { error } = await supabase.from("products").update({ [field]: value }).in("id", selectedIds);
    if (error) alert("Error in bulk update: " + error.message);
    else {
      setSelectedIds([]);
      fetchProducts();
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "SKU", "Category", "Price", "Original Price", "Stock", "Featured", "Best Seller"];
    const csvContent = [
      headers.join(","),
      ...filtered.map((p) => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.sku,
        `"${p.categories?.name || ""}"`,
        p.price,
        p.original_price || "",
        p.stock,
        p.is_featured,
        p.is_bestseller,
      ].join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `savera_products_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derived Data: Filter & Sort
  let filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || p.category_id === filterCategory;
    const matchesAvailability = filterAvailability === "all" || (filterAvailability === "in-stock" ? p.stock > 0 : p.stock <= 0);
    const matchesFeatured = filterFeatured === "all" || (filterFeatured === "featured" ? p.is_featured : !p.is_featured);
    const matchesBestSeller = filterBestSeller === "all" || (filterBestSeller === "best-seller" ? p.is_bestseller : !p.is_bestseller);

    return matchesSearch && matchesCategory && matchesAvailability && matchesFeatured && matchesBestSeller;
  });

  filtered.sort((a, b) => {
    switch (sortBy) {
      case "oldest": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "name-asc": return a.name.localeCompare(b.name);
      case "name-desc": return b.name.localeCompare(a.name);
      case "stock-asc": return a.stock - b.stock;
      case "stock-desc": return b.stock - a.stock;
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Statistics
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    outOfStock: products.filter((p) => p.stock <= 0).length,
    featured: products.filter((p) => p.is_featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500">Manage catalog, inventory, prices, images & variants</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-[var(--color-text-main)] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[var(--color-primary-gold)] transition-colors shadow-sm font-medium text-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Products</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">In Stock</p>
            <p className="text-xl font-bold text-gray-900">{stats.inStock}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Out of Stock</p>
            <p className="text-xl font-bold text-gray-900">{stats.outOfStock}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Star size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Featured</p>
            <p className="text-xl font-bold text-gray-900">{stats.featured}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar: Search, Filters, Sort, Export */}
        <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--color-text-main)] text-sm transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[var(--color-text-main)] bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[var(--color-text-main)] bg-white"
            >
              <option value="all">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[var(--color-text-main)] bg-white"
            >
              <option value="all">All Featured Status</option>
              <option value="featured">Featured Only</option>
              <option value="non-featured">Non-Featured</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[var(--color-text-main)] bg-white font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="p-2 text-gray-600 hover:text-[var(--color-text-main)] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium"
              title="Export to CSV"
            >
              <Download size={16} /> <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-[var(--color-primary-blush)] border-b border-[var(--color-primary-gold)]/30 px-6 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-semibold text-[var(--color-text-main)]">
              {selectedIds.length} products selected
            </span>
            <div className="flex items-center gap-3">
              <button onClick={() => handleBulkUpdate("is_featured", true)} className="text-sm font-medium text-gray-700 hover:text-blue-600">Mark Featured</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => handleBulkUpdate("is_featured", false)} className="text-sm font-medium text-gray-700 hover:text-gray-900">Unfeature</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => handleBulkUpdate("stock", 10)} className="text-sm font-medium text-gray-700 hover:text-emerald-600">Mark In Stock</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => handleBulkUpdate("stock", 0)} className="text-sm font-medium text-gray-700 hover:text-red-600">Mark Out of Stock</button>
              <span className="text-gray-300">|</span>
              <button onClick={handleBulkDelete} className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                <Trash2 size={14} /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length}
                    className="w-4 h-4 text-[var(--color-primary-gold)] border-gray-300 rounded focus:ring-[var(--color-primary-gold)]"
                  />
                </th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-[var(--color-primary-gold)]" />
                    Loading catalog items...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Tag size={32} className="mx-auto mb-3 text-gray-300" />
                    No products found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${selectedIds.includes(product.id) ? 'bg-[var(--color-primary-blush)]/30' : ''}`}>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => handleSelectOne(product.id)}
                        className="w-4 h-4 text-[var(--color-primary-gold)] border-gray-300 rounded focus:ring-[var(--color-primary-gold)]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.images?.[0] || "https://images.unsplash.com/photo-1599643478514-4a4e065f4d1e?q=80&w=200&auto=format&fit=crop"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {product.name}
                            {product.is_featured && <span title="Featured"><Star size={12} className="text-[var(--color-primary-gold)] fill-[var(--color-primary-gold)]" /></span>}
                          </div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-primary-peach)] text-[var(--color-text-main)] whitespace-nowrap">
                        {product.categories?.name || "Jewellery"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">₹{product.price}</div>
                      {product.original_price && (
                        <div className="text-xs text-gray-400 line-through">₹{product.original_price}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        product.stock <= 0 ? 'bg-red-100 text-red-800' :
                        product.stock <= 5 ? 'bg-amber-100 text-amber-800 font-bold' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {product.stock <= 0 ? "Out of Stock" : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="inline-flex text-gray-500 hover:text-[var(--color-primary-gold)] p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title="View Product Live"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gray-500 hover:text-[var(--color-text-main)] p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(product)}
                        className="text-gray-500 hover:text-blue-600 p-1.5 rounded hover:bg-gray-100 transition-colors"
                        title="Duplicate Product"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filtered.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 flex items-center gap-2">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="ml-2 px-2 py-1 border border-gray-200 rounded text-xs bg-gray-50"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to center current page if many pages exist
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 3 + i;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-[var(--color-text-main)] text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-serif text-[var(--color-text-main)] mb-6">
              {editingId ? "Edit Product Details" : "Add New Product"}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="e.g. Royal Pearl Choker"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] font-mono"
                    placeholder="SAV-1001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] font-bold text-gray-900"
                    placeholder="3499"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                    placeholder="4999"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Material</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
                    placeholder="18k Gold Plated Brass"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Colour</label>
                  <input
                    type="text"
                    value={formData.colour}
                    onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
                    placeholder="Champagne Gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
                    placeholder="15g"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-gold)]"
                  placeholder="Handcrafted anti-tarnish luxury piece..."
                />
              </div>

              {/* Upload section */}
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Product Images</label>
                <div className="flex gap-2 items-center mb-2">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-gray-300 transition-colors">
                    {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Upload Image
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <span className="text-xs text-gray-400">or enter image URLs comma-separated</span>
                </div>

                <input
                  type="text"
                  value={formData.images.join(", ")}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value.split(",").map((s) => s.trim()) })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Product Video Link (Optional)</label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-xs"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)] rounded"
                  />
                  Featured Item
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    className="w-4 h-4 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)] rounded"
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="w-4 h-4 text-[var(--color-primary-gold)] focus:ring-[var(--color-primary-gold)] rounded"
                  />
                  Best Seller
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--color-text-main)] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--color-primary-gold)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />} Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
