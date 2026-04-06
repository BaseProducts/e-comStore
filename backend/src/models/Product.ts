import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  gender: string;
  imageUrls: string[];
  sizes: string[];
  stock: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'discountPrice' | 'imageUrls' | 'sizes' | 'isFeatured' | 'isVisible' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  declare public id: string;
  declare public name: string;
  declare public description: string;
  declare public price: number;
  declare public discountPrice?: number;
  declare public category: string;
  declare public gender: string;
  declare public imageUrls: string[];
  declare public sizes: string[];
  declare public stock: number;
  declare public isFeatured: boolean;
  declare public isVisible: boolean;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discountPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Men', 'Women', 'Kid', 'Unisex'),
      defaultValue: 'Unisex',
      allowNull: false,
    },
    imageUrls: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    sizes: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'Products',
    timestamps: true,
  }
);

export default Product;
