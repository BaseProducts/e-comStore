import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface OtpAttributes {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
}

interface OtpCreationAttributes extends Optional<OtpAttributes, 'id'> {}

class Otp extends Model<OtpAttributes, OtpCreationAttributes> implements OtpAttributes {
  declare public id: string;
  declare public email: string;
  declare public otp: string;
  declare public expiresAt: Date;
}

Otp.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Otps',
    timestamps: true,
  }
);

export default Otp;
