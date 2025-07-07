import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        otp: {
          type: DataTypes.STRING(10),
          allowNull: true
        },
        otpExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        verificationToken: {
          type: DataTypes.STRING(255),
          allowNull: true
        },
        verificationDeadline: {
          type: DataTypes.DATE,
          allowNull: true
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        loginToken: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        loginTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        role: {
          type: DataTypes.ENUM('Super Admin', 'User'),
          defaultValue: 'User'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: false // camelCase column names
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Client, {
      foreignKey: 'assigningUserId',
      as: 'clients'
    });
  }
}

export default User;
