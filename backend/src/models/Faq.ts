import { DataTypes, Model } from 'sequelize';
import type { Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface FaqAttributes {
  id: string;
  question: string;
  answer: string;
  isVisible: boolean;
  order: number;
}

interface FaqCreationAttributes extends Optional<FaqAttributes, 'id' | 'isVisible' | 'order'> {}

class Faq extends Model<FaqAttributes, FaqCreationAttributes> implements FaqAttributes {
  public id!: string;
  public question!: string;
  public answer!: string;
  public isVisible!: boolean;
  public order!: number;
}

Faq.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  sequelize,
  tableName: 'Faqs',
  timestamps: true,
});

export default Faq;
