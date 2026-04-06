import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

interface SettingAttributes {
  key: string;
  value: string;
}

interface SettingCreationAttributes {
  key: string;
  value: string;
}

class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
  declare public key: string;
  declare public value: string;

  declare public readonly createdAt: Date;
  declare public readonly updatedAt: Date;
}

Setting.init(
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Setting',
    tableName: 'Settings',
    timestamps: true,
  }
);

export default Setting;
