const mongoose = require("mongoose");
const Product = require("./product");
const { Schema } = mongoose;

const farmSchema = Schema({
  name: {
    type: String,
    required: [true, "Farm must have a name!"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email Required!"],
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

// farmSchema.pre("findOneAndDelete", async (data) => {
//   console.log("pre middleware");
//   console.log(data);
// });

farmSchema.post("findOneAndDelete", async (farm) => {
  if (farm.products.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } });
    console.log(res);
  }
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
