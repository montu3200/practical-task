const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        nNo: {
            type: Number,
        },
        sName: {
            type: String,
        },
        oCategory:{
            type:mongoose.Types.ObjectId,
            ref:'category'
        },
        nPrice:{
            type:Number
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
productSchema.pre('save', async function (next) {
    const user = this;
    const lastRecord= await ProductData.findOne({}).sort({_id:-1}).limit(1);
    if(lastRecord){
        user.nNo = lastRecord.nNo + 1;
    }else{
        user.nNo = 1
    }
    next();
});
const ProductData = mongoose.model('product', productSchema);

module.exports = ProductData;