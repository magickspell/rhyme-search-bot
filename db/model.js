import {sequelize} from './db.js';
import {DataTypes} from 'sequelize';

// creating models
export const SongModel = sequelize.define('song', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  artist: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING,
    unique: true
  },
  chorus: {
    type: DataTypes.STRING(1000)
  }
})