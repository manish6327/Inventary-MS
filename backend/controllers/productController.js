import ProductModel from "../models/Product.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, supplier } = req.body;

    if (
      !name ||
      !description ||
      price === undefined ||
      stock === undefined ||
      !category ||
      !supplier
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      stock,
      category,
      supplier,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};

// Get Products
export const getProducts = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("category", "categoryName")
      .populate("supplier", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error getting products:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while getting products",
    });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, stock, category, supplier } = req.body;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        category,
        supplier,
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};
