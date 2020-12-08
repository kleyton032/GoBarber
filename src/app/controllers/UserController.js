import User from '../models/User';

class UserController {
  
  async store(req, res, next) {
    try {
      const userExists = await User.findOne({ where: { email: req.body.email } });
      if (userExists) return res.status(400).send({ error: "Usuário já existe na base de dados" })
      const {id, name, email, provider} = await User.create(req.body);
      return res.json({ 
        id,
        name,
        email,
        provider
       });
    } catch (error) {
      console.warn(error);
      next(error);
    }

  }

  async update(req, res){
    return res.send({ok: true});
  }
}

export default new UserController();