const mongoose = require("mongoose");
mongoose
    .connect("mongodb://localhost:27017/shopApp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connection open!!");
    })
    .catch((err) => {
        console.log("error!!");
        console.log(err);
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price must be positive ya dodo!"],
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0,
        },
        inStore: {
            type: Number,
            default: 0,
        },
    },
    size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL"],
    },
});

const Product = mongoose.model("Product", productSchema);

const bike = new Product({
    name: "Cycling Jersey",
    price: 28.5,
    categories: ["Cycling"],
    size: "XS",
});

bike
    .save()
    .then((data) => {
        console.log("IT WORKED!");
        console.log(data);
    })
    .catch((err) => {
        console.log("OH NO ERROR!");
        console.log(err);
    });
// method
productSchema.methods.toggleOnSale = function() {
    this.onSale = !this.onSale;
    return this.save();
};

productSchema.methods.addCategory = function(newCat) {
    this.categories.push(newCat);
    return this.save();
};

productSchema.statics.fireSale = function() {
    return this.updateMany({}, { onSale: true, price: 0 });
};

const findProduct = async() => {
    const foundProduct = await Product.findOne({ name: "Mountain Bike" });
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
    await foundProduct.addCategory("Outdoors");
    console.log(foundProduct);
};