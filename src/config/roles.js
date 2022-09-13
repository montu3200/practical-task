const { ROLES } = require('../config/constant');
const roles = [ROLES.ADMIN,ROLES.USER];
const roleRights = new Map();

roleRights.set(roles[0], ['userlist','category','product']);
roleRights.set(roles[1], ['productlist']);

module.exports = {
	roles,
	roleRights,
};
