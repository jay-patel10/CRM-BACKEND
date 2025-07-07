import { Model, DataTypes } from 'sequelize';

class Client extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        srNo: {
          type: DataTypes.INTEGER
        },
        sfId: {
          type: DataTypes.STRING
        },
        name: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING
        },
        departmentType: {
          type: DataTypes.STRING
        },
        checklistStatus: {
          type: DataTypes.STRING
        },
        assigningUserId: {
          type: DataTypes.INTEGER
        },
        status: {
          type: DataTypes.ENUM('Active', 'Inactive'),
          defaultValue: 'Active'
        },
        logo: {
          type: DataTypes.STRING
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
        modelName: 'Client',
        tableName: 'clients',
        timestamps: true,
        underscored: false // camelCase for consistency
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'assigningUserId',
      as: 'assigningUser'
    });
  }
}

export default Client;
