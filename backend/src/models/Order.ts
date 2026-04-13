import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

interface OrderAttributes {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
}

interface OrderCreationAttributes extends Omit<OrderAttributes, 'id' | 'status' | 'paymentStatus' | 'stripeSessionId' | 'stripePaymentIntentId'> {
  status?: string;
  paymentStatus?: string;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  declare public id: string;
  declare public userId: string;
  declare public fullName: string;
  declare public email: string;
  declare public phone: string;
  declare public address: string;
  declare public city: string;
  declare public state: string;
  declare public zipCode: string;
  declare public subtotal: number;
  declare public tax: number;
  declare public shipping: number;
  declare public total: number;
  declare public status: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  declare public paymentMethod: string;
  declare public paymentStatus: 'pending' | 'paid' | 'failed';
  declare public stripeSessionId: string | null;
  declare public stripePaymentIntentId: string | null;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

Order.init(
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
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    shipping: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'stripe',
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: true,
  }
);

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Order;
