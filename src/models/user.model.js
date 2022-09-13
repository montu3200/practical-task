const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { pick } = require('lodash');

const userSchema = mongoose.Schema(
    {
        sFullname: {
            type: String,
        },
        sEmail: {
            type: String,
        },
        sPassword: {
            type: String,
        },
        sUserRole: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
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
userSchema.methods.transform = function () {
    const user = this;
    return pick(user.toJSON(), ['id', 'sFullname', 'sEmail', 'sUserRole', 'status']);
};
userSchema.pre('save', async function (next) {
    const user = this;
    user.sPassword = await bcrypt.hash(user.sPassword, 8);
    next();
});
const UserData = mongoose.model('users', userSchema);

module.exports = UserData;