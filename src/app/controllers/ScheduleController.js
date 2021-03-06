import {startOfDay, endOfDay, parseISO} from 'date-fns';
import Appointment from '../models/Appointment';
import {Op} from  'sequelize';
import User from '../models/User';


class ScheduleController {
  
  async index(req, res) {
    const checkProvider = await User.findOne({
      where: {id: req.userId, provider: true}
    })

    if(!checkProvider) return res.status(401).json({error: 'Usuário não é um provedor de serviços'});

    const {date} = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where:{
        provider_id:req.userId,
        canceled_at: null,
        date:{
          [Op.between]: [
             startOfDay(parsedDate), endOfDay(parsedDate)
          ]
        }
      },
      order: ['date'],
    })

    return res.json({appointments})
  }

}

export default new ScheduleController();