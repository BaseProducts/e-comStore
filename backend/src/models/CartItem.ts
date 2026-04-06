import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Product from './Product.js';

interface CartItemAttributes {
  id: string;
  userId: string;
  productId: string;
  size: string;
  quantity: number;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'id' | 'quantity'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  declare public id: string;
  declare public userId: string;
  declare public productId: string;
  declare public size: string;
  declare public quantity: number;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'CartItems',
    timestamps: true,
  }
);

// Define associations with explicit constraint names to avoid sync errors
CartItem.belongsTo(User, { 
  foreignKey: { name: 'userId', allowNull: false }, 
  as: 'user',
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

CartItem.belongsTo(Product, { 
  foreignKey: { name: 'productId', allowNull: false }, 
  as: 'product',
  constraints: true,
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

// Inverse associations
if (!User.associations.cartItems) {
  User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems' });
}
if (!Product.associations.cartItems) {
  Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
}

export default CartItem;
