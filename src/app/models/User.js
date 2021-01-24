import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      provider: Sequelize.STRING
    },
    {
      sequelize 
    });

    this.addHook('beforeSave', async(user) => {
      if(user.password) user.password_hash = await bcrypt.hash(user.password, 8);
    })  

    return this;

  }

  static associate(models) {
    this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar'});
  }

  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }

  //getUser(){
    //return {
      //nome: this.name, 
      //password: this.password_hash, 
    //  email: this.email
  //  }
    
  

}

export default User;