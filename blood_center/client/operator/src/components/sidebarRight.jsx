import React, {useEffect, useState} from 'react';
import '../styles/sidebarRight.css';

const SidebarRight = ({reserve, setReserve}) => {

  	useEffect(() => {
		const eventListener = new EventSource('http://localhost:5000/api/sse_reserve');

		eventListener.onmessage = ((event) => {
			const data = JSON.parse(event.data);
      if(Array.isArray(data)) {
        setReserve((prevState) => [...prevState, ...data]);
      } else {
        setReserve((prevState) => {
          const index = prevState.findIndex(item => item.id == data.id); 
          prevState[index].count = data.count;
          return [...prevState];
        });
      }
		})

		return () => {
			eventListener.close();
		};
  	}, [])

  return (
    <div className="sidebar-right">
      <h3>Резерв</h3>
      {
        reserve.map((item, index) => (
          <div key={index}>&nbsp;В-во: {item.substance};  гр.: {item.group};  
		  Rh.: {item.rhesus}; 'кол-во': {item.count} {item['measurement_unit.unit']} {(index + 1) % 8 == 0 ? <hr/> : ''}</div>
        ))
      }
    </div>
  );
};

export default SidebarRight;