// Run with: npm run seed
// Wipes existing products/users and inserts demo data so the app has
// something to show immediately — recruiters judge a populated app
// far more favorably than an empty one.

const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Product = require("../models/Product");
const User = require("../models/User");

dotenv.config();

const products = [
  {
    name: "Speckled Stoneware Mug",
    description: "A hand-thrown mug in warm speckled clay, finished with a matte oatmeal glaze. Holds 350ml — big enough for your morning coffee, small enough to feel right in your hand.",
    category: "mugs",
    price: 850,
    stock: 24,
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800"],
    glaze: "Matte oatmeal",
    isFeatured: true,
  },
  {
    name: "Sage Ridged Bowl",
    description: "A wide, shallow bowl with a hand-carved ridge pattern, glazed in muted sage green. Perfect for salads or as a fruit bowl on the counter.",
    category: "bowls",
    price: 1200,
    stock: 15,
    images: ["https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800","https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800"],
    glaze: "Sage matte",
    isFeatured: true,
  },
  {
    name: "Charcoal Bud Vase",
    description: "A slim, single-stem vase in deep charcoal stoneware. Designed to hold one or two flowers — a quiet, minimal accent for a shelf or windowsill.",
    category: "vases",
    price: 950,
    stock: 18,
    images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800"],
    glaze: "Charcoal satin",
    isFeatured: true,
  },
  {
    name: "Terracotta Planter, Small",
    description: "An unglazed terracotta planter with a drainage hole and matching saucer. The raw clay finish develops a natural patina over time as it takes on water.",
    category: "planters",
    price: 650,
    stock: 30,
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"],
    glaze: "Unglazed raw clay",
    isFeatured: false,
  },
  {
    name: "Clay Dinner Plate Set (4)",
    description: "A set of four dinner plates in warm clay tones, each one slightly different from hand-finishing. Dishwasher and microwave safe.",
    category: "tableware",
    price: 2400,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1584346133934-a3afd2a33c4a?w=800"],
    glaze: "Warm clay matte",
    isFeatured: true,
  },
  {
    name: "Speckled Trinket Dish",
    description: "A small catch-all dish for rings, keys, or loose change by the door. Finished in the same speckled glaze as our signature mug line.",
    category: "decor",
    price: 450,
    stock: 40,
    images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
    glaze: "Matte oatmeal",
    isFeatured: false,
  },
  {
    name: "Sage Serving Bowl, Large",
    description: "The bigger sibling of our ridged bowl line — ideal for serving pasta or salad at the table. Each piece is wheel-thrown, so expect small variations.",
    category: "bowls",
    price: 1800,  
    stock: 8,
    images: ["https://images.unsplash.com/photo-1610736342338-2eb151f7b8c0?w=800"],
    glaze: "Sage matte",
    isFeatured: false,
  },
  {
    name: "Charcoal Pour-Over Mug",
    description: "A taller mug shaped for pour-over coffee, in matte charcoal with a natural clay rim. Comes with a matching saucer.",
    category: "mugs",
    price: 950,
    stock: 20,
    images: ["https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800"],
    glaze: "Charcoal satin",
    isFeatured: false,
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany({ email: "admin@kilnandco.test" });

    for (const product of products) {
      await Product.create(product);
    }

    await User.create({
      name: "Store Admin",
      email: "admin@kilnandco.test",
      password: "admin1234", // change after first login in a real deployment
      isAdmin: true,
    });

    console.log("Seed data imported successfully");
    console.log("Admin login: admin@kilnandco.test / admin1234");
    process.exit();
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

importData();
