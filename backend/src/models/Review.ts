import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface ReviewAttributes {
  id: string;
  name: string;
  location: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'status'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: string;
  public name!: string;
  public location!: string;
  public message!: string;
  public status!: 'pending' | 'approved' | 'rejected';
}

Review.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  }
}, {
  sequelize,
  tableName: 'Reviews',
  timestamps: true,
});

export default Review;
