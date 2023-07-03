import {BloodReserve, MeasurementUnit, HospitalQuery, Donation, Donor, DonorInfo} from '../models/models.js';
import { Op } from 'sequelize';

function setSSEHeaders(res) {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    })
}

export default new class Controller {

    async query(req, res, next) {
        try {
            const {hospital, substance, group, rhesus, count, date, fio_doctor, time} = req.body;
            
            const query = await HospitalQuery.create({hospital, substance, group, rhesus, count, fio_doctor, date_time_query: `${time} ${date}`});
            
            req.app.emit('query', query);
            res.sendStatus(200);
        } catch(err) {
            next(err);
        }
    }
    
    async sse_query(req, res, next) {
        try {
            setSSEHeaders(res);

            const queryData = await HospitalQuery.findAll({ 
                order: ['id'], 
                where: {
                    date_time_answer: { [Op.is]: null }
                }
            });  

            res.write(`data: ${JSON.stringify(queryData)} \n\n`); 

            req.app.on('query', (data) => {
                res.write(`data: ${JSON.stringify(data)} \n\n`);
            });
        } catch(err) {
            next(err);
        }
    }

    async sse_reserve(req, res, next) {
        try {
            setSSEHeaders(res);

            const reserveData = await BloodReserve.findAll({ 
                attributes: {
                    exclude: ['measurementUnitId'],
                },
                order: ['substance', 'group', 'rhesus'], 
                include: [{
                    attributes: ['unit'],
                    model: MeasurementUnit,
                    required: true
            }], 
                raw: true
            });  

            res.write(`data: ${JSON.stringify(reserveData)} \n\n`); 

            req.app.on('reserve', (substance) => {
                res.write(`data: ${JSON.stringify(substance)} \n\n`);
            });
        } catch(err) {
            next(err);
        }
    }

    async update_reserve(req, res, next) {
        try {
            const {id, count} = req.body;

            const substance = await BloodReserve.findByPk(id);
            substance.count += count;
            await substance.save(); 
            
            req.app.emit('reserve', substance);
            res.sendStatus(200);
        } catch(err) {
            next(err);
        }
    }

    async update_date_query(req, res, next) {
        try {
            const {id, date} = req.body;
            const queryData = await HospitalQuery.findByPk(id);
            
            queryData.date_time_answer = date;
            await queryData.save();
            res.sendStatus(200);
        } catch(err) {
            next(err);
        }
    }

    async get_donors(req, res, next) {
        try {
            const {group, substance, rhesus} = req.query;
            let donors;
            console.log('object :>> ', group, substance, rhesus);

            if(substance === 'эриторициты') {
                donors = await Donation.findAll({
                    attributes: [],
                    where: {    
                        date_next_donation_blood: {
                            [Op.gte]: '2023-05-11'
                        }
                    },
                    include: [{
                        model: Donor,
                        required: true,
                        attributes: ['fio'],
                        include: [{
                            model: DonorInfo,
                            attributes: ['phone_number'],
                            where: {
                                [Op.and]: [{group: group}, {rhesus: rhesus}]
                            },
                            required: true,
                        }]
                    }], 
                    raw: true
                })
            } else {
                donors = await Donation.findAll({
                    attributes: [],
                    where: {    
                        date_next_donation_blood_component: {
                            [Op.gte]: '2023-05-11'
                        }
                    },
                    include: [{
                        model: Donor,
                        required: true,
                        attributes: ['fio'],
                        include: [{
                            model: DonorInfo,
                            attributes: ['phone_number'],
                            where: {
                                [Op.and]: [{group: group}, {rhesus: rhesus}]
                            },
                            required: true,
                        }]
                    }], 
                    raw: true
                })
            }
            console.log('donors :>> ', donors);
            res.json(donors);
        } catch(err) {
            next(err);
        }
    }
}