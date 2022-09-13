const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        sName: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Delete"],
            default: "Active",
        }

    },
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    },
);
const CategoryData = mongoose.model('category', categorySchema);

module.exports = CategoryData;