import Header from './components/header';
import Sidebar from './components/sidebar';
import Content from './components/content';
import SidebarRight from './components/sidebarRight';
import objectType from './objectType.js';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {

  const [query, setQuery] = useState([])
  const [element, setElement] = useState(null);
  const [reserve, setReserve] = useState([]);
  const [donors, setDonors] = useState([]);
  const [resurs, setResurs] = useState({})

  let substance;
  let disadvantage = {};

  if(element) {
    substance = reserve.find(item => item.substance === objectType[element.substance] && item.group === element.group && item.rhesus === element.rhesus);
    let tp = substance['measurement_unit.unit'];
    if(substance.count - parseInt(element.count) < 0) {
      axios.get(`http://localhost:5000/api/donors?group=${element.group}&substance=${element.substance}&rhesus=${encodeURIComponent(element.rhesus)}`)
      .then(response => {
        if(donors.length == 0 || (JSON.stringify(donors) !== JSON.stringify(response.data))) {
          setDonors(response.data)
        }})
      disadvantage = parseInt(element.count) - substance.count;
      setResurs({disadvantage, tp, group: substance.group, rhesus: substance.rhesus, substance: substance.substance})
      setElement(null);
    }
  }

  async function updateReserve() {
    const currentDate = new Date();
    const time = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); 
    const date = currentDate.toLocaleDateString('ru-RU',  {day: '2-digit', month: '2-digit', year: 'numeric'});
    await axios.patch('http://localhost:5000/api/update_reserve', {id: substance.id, count: -parseInt(element.count)});
    await axios.patch('http://localhost:5000/api/update_date_query', {id: element.id, date: `${time} ${date}`})
    setQuery((prevState) => {
      const index = prevState.findIndex(item => item.id === element.id);
      prevState.splice(index, 1);
      return [...prevState];
    })
    setElement(null);
  }

  return (
    <>
      <Header />
      <div className='main'>
        <Sidebar setElement={setElement} query={query} setQuery={setQuery}/>
        <Content element={element} update={updateReserve} donors={donors} resurs={resurs}/>
        <SidebarRight reserve={reserve} setReserve={setReserve}/>
      </div>
    </>
  );
}

export default App;
