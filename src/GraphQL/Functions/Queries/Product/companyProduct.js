const Shop = require("../../../../Schema/Company/Shop/Shop.model");
const useGet = require("../../../../Redis/useGet/useGet");
const useSet = require("../../../../Redis/useSet/useSet");
const { GraphQLError } = require("graphql");

const companyProduct = async ({ shopID }) => {
  try {
    const redisQuery = `shop/${shopID}`;

    // check if the shop are cached
    const redisShop = await useGet(redisQuery);

    //if the shop is cached return it
    if (redisShop) return redisShop;

    const shop = await Shop.findById(shopID);

    if (!shop.isActive) throw new Error("shop is not active");

    await useSet(redisQuery, shop);
    return shop;
  } catch (e) {
    console.log("error while fetching the shop product");
    throw new GraphQLError(e.message);
    return null;
  }
};

module.exports = companyProduct;
