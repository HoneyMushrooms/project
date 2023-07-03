import React from 'react';
import '../styles/content.css';

const Content = ({element, update, donors, resurs}) => {
  return (
    <div>
      {element ? 
      <div className="content">
        <h3>Запрос № {element.id}</h3>
        <ul>
          <li className='style'>Больница: {element.hospital}</li>
          <li>Вещество: {element?.substance}</li>
          <li>Группа: {element?.group}</li>
          <li>Резус: {element?.rhesus}</li>
          <li>Количество: {element?.count}</li>
          <li>ФИО лечащего врача: {element?.fio_doctor}</li>
        </ul>
        <button onClick={update}>Обработать запрос</button>
      </div> 
      : donors.length !== 0 ? 
      <>
        <h3 className='el'>Нехватает {`${resurs.disadvantage} ${resurs.tp} (${resurs.substance} ${resurs.group} ${resurs.rhesus})`}</h3>
        {donors.map((donor) => (
          <div key={donor['donor.donor_info.id']} className='donor'>
            ФИО: {donor['donor.fio']};  Номер донора: {donor['donor.donor_info.phone_number']};  
          </div>
        ))}
      </>        
        : ''}
    </div>
  );
};

export default Content;