import React, { useEffect, useState } from 'react';
import '../styles/sidebar.css';

const Sidebar = ({setElement, query, setQuery}) => {

  useEffect(() => {
    const eventListener = new EventSource('http://localhost:5000/api/sse_query');

    eventListener.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if(Array.isArray(data)) {
        setQuery((prevState) => [...prevState, ...data]);
      } else {
        setQuery((prevState) => [...prevState, data]);
      }
    })

    return () => {
      eventListener.close();
    };
  }, [])


  return (
    <div className="sidebar">
      <h3>Запросы</h3>
      {query.map((query, index) => (
        <div className='element' key={index} onClick={() => setElement(query)}>
        Больница: {query.hospital}<br/> Время: {query.date_time_query.split(' ')[0]}<br/> Дата: {query.date_time_query.split(' ')[1]}</div>
      ))}
    </div>
  );
};

export default Sidebar;
