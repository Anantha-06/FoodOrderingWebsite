import { Cart } from "../models/cartModel.js";
import { Restaurant } from "../models/restaurantModel.js";

export async function addToCart(req, res) {
  try {
    const userId = req.user.id;
    const { foodId, restaurantId, quantity } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menuItem = restaurant.menu.id(foodId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const itemPrice = menuItem.price * quantity;
    let cart = await Cart.findOne({ userId, cartStatus: { $ne: "ordered" } });
    if (cart && cart.restaurantId.toString() !== restaurantId) {
      return res.status(409).json({
        message: "Item from different restaurant is already added to cart",
      });
    }
    if (!cart) {
      cart = new Cart({
        userId,
        restaurantId,
        items: [],
        totalPrice: 0,
        finalPrice: 0,
      });
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalItemPrice += itemPrice;
    } else {
      cart.items.push({
        foodId,
        foodName:menuItem.name,
        quantity,
        totalItemPrice: itemPrice,
        foodImage:menuItem.image,
      });
    }
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );
    cart.finalPrice = cart.totalPrice;
    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function addQuantity(req, res) {
  try {
    const userId = req.user.id;
    const { foodId, action } = req.body;
    if (!["increment", "decrement"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'increment' or 'decrement'." });
    }
    const cart = await Cart.findOne({ userId, cartStatus: { $ne: "ordered" } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    const restaurant = await Restaurant.findById(cart.restaurantId);
    const menuItem = restaurant?.menu.id(foodId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const item = cart.items[itemIndex];
    if (action === "increment") {
      item.quantity += 1;
      item.totalItemPrice += menuItem.price;
      cart.totalPrice += menuItem.price;
    } else if (action === "decrement") {
      if (item.quantity > 1) {
        item.quantity -= 1;
        item.totalItemPrice -= menuItem.price;
        cart.totalPrice -= menuItem.price;
      } else {
        cart.totalPrice -= item.totalItemPrice;
        cart.items.splice(itemIndex, 1);
      }
    }
    cart.finalPrice = cart.totalPrice;
    await cart.save();
    return res.status(200).json({ message: "Item quantity updated", cart });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getCart(req, res) {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId, cartStatus: { $ne: "ordered" } });
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    const restaurant = await Restaurant.findById(cart.restaurantId);
    cart.items = cart.items.map((cartItem) => {
      const menuItem = restaurant?.menu.id(cartItem.foodId);
      return {
        ...cartItem.toObject(),
        name: menuItem?.name || "Unknown",
        price: menuItem?.price || 0,
      };
    });
    res.status(200).json({ message: "Cart items fetched", data: cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteCartItem(req, res) {
  try {
    const userId = req.user.id;
    const { foodId } = req.params;
    const cart = await Cart.findOne({ userId, cartStatus: { $ne: "ordered" } });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.foodId.toString() === foodId
    );
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.totalItemPrice,
        0
      );
      cart.finalPrice = cart.totalPrice;
      if (cart.items.length === 0) {
        await Cart.findOneAndDelete({ userId, cartStatus: { $ne: "ordered" } });
        return res.status(200).json({ message: "Cart deleted" });
      }
      await cart.save();
      return res.status(200).json({ message: "Item removed from cart", cart });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
