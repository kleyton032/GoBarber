import * as Yup from 'yup';
import {startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment';
import File from '../models/File';
import User from '../models/User';

class AppointmentController {
 
  async index(req, res){
    const {page = 1} = req.query;
    const appointments = await Appointment.findAll({
      where:{user_id: req.userId, canceled_at: null},
      order: ['date'],
      attributes: ['id', 'date', 'canceled_at'],
      limit:20,
      offset: (page -1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include:[
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        } 
      ]
    })
    
    return res.json(appointments);
    
  }

  
  async store(req, res){
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    })
    if(!(await schema.isValid(req.body))) return res.status(400).send({error: "Campos inválidos"})
    
    const {provider_id, date} = req.body; 
 
    const isProvider = await User.findOne({
      where:{id:provider_id, provider: true}
    });

    if(!isProvider) return res.status(401).json({error:"Só é permitido gerar agendamentos do tipo provider"});

    const hourStart = startOfHour(parseISO(date));

    //validando data anterior a do dia do agendamento
    if(isBefore(hourStart, new Date())) {
      return res.status(400).send({error: "Não é possível agendar para um data inferior a de hoje!"})
    }

    // chekando a data e hora se já não está nada agendado

    const checkDateTime = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    })

    if(checkDateTime) return res.status(400).send({error: "Data e hora já possui agendamento!"}) 

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    })

    return res.json({appointment});
  }
}

export default new AppointmentController();