import { cloudinaryInstance } from "../config/cloudinary.js";
import { Restaurant } from "../models/restaurantModel.js";

export const addMenuItem = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { name, price, description, category } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant Not Found" });
    }
    const existingMenuItem = restaurant.menu.find(
      (item) => item.name === name && item.category === category
    );
    if (existingMenuItem) {
      return res.status(400).json({ message: "Menu item already exists" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    const imageUri = await cloudinaryInstance.uploader.upload(req.file.path);
    const newMenuItem = {
      name,
      price,
      description,
      image: imageUri.url,
      category,
    };
    restaurant.menu.push(newMenuItem);
    await restaurant.save();
    res
      .status(201)
      .json({ message: "Menu item added successfully", menu: restaurant.menu });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export async function updateMenu(req, res) {
  try {
    const { restaurantId } = req.params;
    const { name, price, description, image, category } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant Not Found" });
    }
    const { menuItemId } = req.params;
    const menuItem = restaurant.menu.id(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    if (name) menuItem.name = name;
    if (price) menuItem.price = price;
    if (description) menuItem.description = description;
    if (category) menuItem.category = category;
    if (req.file) {
      if (menuItem.image) {
        const imagePublicId = menuItem.image.split("/").pop().split(".")[0];
        await cloudinaryInstance.uploader.destroy(imagePublicId);
      }
      const imageUri = await cloudinaryInstance.uploader.upload(req.file.path);
      menuItem.image = imageUri.url;
    }
    await restaurant.save();

    res.status(200).json({
      message: "Menu item updated successfully",
      menu: restaurant.menu,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getMenuByName(req, res) {
  try {
    const { name } = req.params;
    const restaurants = await Restaurant.find();
    let foundMenuItem = null;
    for (const restaurant of restaurants) {
      foundMenuItem = restaurant.menu.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );
      if (foundMenuItem) break;
    }
    if (!foundMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ menuItem: foundMenuItem });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getAllMenu = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    const allMenuItems = restaurants.reduce((menuItems, restaurant) => {
      return menuItems.concat(restaurant.menu);
    }, []);
    if (allMenuItems.length === 0) {
      return res.status(404).json({ message: "No menu items found" });
    }
    res.status(200).json({ menuItems: allMenuItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menuItem = restaurant?.menu.id(menuItemId);
    console.log(menuItem)
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    console.log(error);                                                
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { restaurantId, menuItemId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menuItem = restaurant.menu.id(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    await Restaurant.findByIdAndUpdate(
      restaurantId,
      {
        $pull: { menu: { _id: menuItemId } }
      },
      { new: true }
    );
    await restaurant.save();
    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};
