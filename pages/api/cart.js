export default function handler(req, res) {
  const data = {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        // Using a more reliable placeholder image service
        image: "https://placehold.co/150x150?text=Bamboo",
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://placehold.co/150x150?text=Bags",
      },
    ],
    shipping_fee: 50,
    discount_applied: 0,
  };

  res.status(200).json(data);
}

