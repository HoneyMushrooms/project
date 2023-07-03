import db from "../db.js";
import { DataTypes } from "sequelize";

const Donor = db.define('donor', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fio: {type: DataTypes.STRING, allowNull: false}
});

const DonorInfo = db.define('donor_info', {
    rhesus: {type: DataTypes.STRING, allowNull: false},
    group: {type: DataTypes.INTEGER, allowNull: false},
    phone_number: {type: DataTypes.STRING, allowNull: false}
});

const Donation = db.define('donation', {
    date_next_donation_blood: {type: DataTypes.DATEONLY},
    date_next_donation_blood_component: {type: DataTypes.DATEONLY},
    count_donation: {type: DataTypes.INTEGER, defaultValue: 3}
});

const BloodReserve = db.define('blood_reserve', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    substance: {type: DataTypes.STRING, allowNull: false},
    group: {type: DataTypes.INTEGER, allowNull: false},
    rhesus: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.INTEGER, defaultValue: 1000}
});

const MeasurementUnit = db.define('measurement_unit', {
    unit: {type: DataTypes.STRING, allowNull: false}
})

const TypeDonation = db.define('type_donation', {
    
})

const HospitalQuery = db.define('hospital_query', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    hospital: {type: DataTypes.STRING, allowNull: false},
    substance: {type: DataTypes.STRING, allowNull: false},
    group: {type: DataTypes.INTEGER, allowNull: false},
    rhesus: {type: DataTypes.STRING, allowNull: false},
    count: {type: DataTypes.STRING, allowNull: false},
    fio_doctor: {type: DataTypes.STRING, allowNull: false},
    date_time_query: {type: DataTypes.STRING, allowNull: false},
    date_time_answer: {type: DataTypes.STRING},
})

Donor.hasOne(DonorInfo);
DonorInfo.belongsTo(Donor);

Donor.hasOne(Donation);
Donation.belongsTo(Donor);

MeasurementUnit.hasMany(BloodReserve);
BloodReserve.belongsTo(MeasurementUnit);

export {BloodReserve, MeasurementUnit, HospitalQuery, Donor, DonorInfo, Donation};
