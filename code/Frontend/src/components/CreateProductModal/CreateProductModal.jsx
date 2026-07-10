import React, { useState, useRef } from "react";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";
import "./CreateProductModal.css";
import { createProduct } from "../../api/productsService";

const CreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!productName || !description || !price) {
      setError("Please fill out all required fields.");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await createProduct(formData);
      if (res.data?.success) {
        setProductName("");
        setDescription("");
        setPrice("");
        setImages([]);
        onProductCreated(res.data.product);
        onClose();
      } else {
        setError(res.data?.message || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cprod-overlay" onClick={onClose}>
      <div className="cprod-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cprod-header">
          <h2>Create New Product</h2>
          <button className="cprod-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="cprod-form" onSubmit={handleSubmit}>
          {error && <div className="cprod-error">{error}</div>}
          
          <div className="cprod-field">
            <label>Product Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Handmade Silk Scarf" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="cprod-field">
            <label>Price (LKR) *</label>
            <input 
              type="number" 
              placeholder="e.g. 5000" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isLoading}
              min="0"
            />
          </div>

          <div className="cprod-field">
            <label>Description *</label>
            <textarea 
              placeholder="Describe your product..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              disabled={isLoading}
            />
          </div>

          <div className="cprod-image-upload-section">
            <label>Product Images (Max 5)</label>
            <div 
              className="cprod-upload-area" 
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={32} color="#4a24e1" />
              <span>Click to browse images</span>
              <input 
                type="file" 
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>
            
            {images.length > 0 && (
              <div className="cprod-image-previews">
                {images.map((img, idx) => (
                  <div className="cprod-preview-item" key={idx}>
                    <img src={URL.createObjectURL(img)} alt={`Preview ${idx}`} />
                    <button 
                      type="button" 
                      className="cprod-remove-img" 
                      onClick={() => removeImage(idx)}
                      disabled={isLoading}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cprod-footer">
            <button type="button" className="cprod-cancel-btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="cprod-submit-btn" disabled={isLoading || !productName || !price || !description}>
              {isLoading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
