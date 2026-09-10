import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, createProduct, updateProduct } from "../../services/productService";
import ProductForm from "../../components/admin/ProductForm";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

export default function AdminProductEdit() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    getProductById(id)
      .then((p) =>
        setInitialValues({
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          stock: p.stock,
          images: p.images.join(", "),
          glaze: p.glaze || "",
          isFeatured: p.isFeatured,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateProduct(id, values);
      } else {
        await createProduct(values);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
      <h1 className="font-display text-2xl text-ink mb-8">
        {isEditing ? "Edit product" : "Add a new product"}
      </h1>
      {error && <div className="mb-6"><ErrorMessage message={error} /></div>}
      {(!isEditing || initialValues) && (
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel={isEditing ? "Save changes" : "Create product"}
        />
      )}
    </div>
  );
}
