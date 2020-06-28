import React, { useEffect, useState, useCallback } from 'react';
import ReactLoading from 'react-loading';
import api from './services/api';
import './assets/global.css';
import './App.css';
import './SideBar.css';
import './Main.css';

const App:React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [githubUsername, setGitHubUsername] = useState<string | number>('');
  const [techs, setTechs] = useState<string | number>('');
  const [latitude, setLatitude] = useState<string | number>('');
  const [longitude, setLongitude] = useState<string | number>('');
  const [loadUsers, setLoadUsers] = useState<boolean>(false);
  const [savingUser, setsavingUser] = useState<boolean>(false);

  useEffect(()=>{
    window.navigator.geolocation.getCurrentPosition(
      (position )=> {
        console.log('position: ', position);
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

      },
      (err )=> {
        console.log(err)
      },
      {
        timeout: 30000,
      }
    );
  },[])

  useEffect(()=>{
    async function loadUsers(){
      try{  
        const { data } = await api.get('/user')
        console.log(data)
        setUsers(data);
      }
      catch(err){
        console.log(err)
      }
    }
    loadUsers();
  },[])

  const handleAddDev = useCallback(async (e: React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const request = {
      github_username: githubUsername,
      techs,
      latitude,
      longitude
    }
    setsavingUser(true);
    try{
      const { data } = await api.post('/user', request);
      setUsers(users=>[...users, data])
      setsavingUser(false);

    }
    catch(err){
      console.log(Object.getOwnPropertyDescriptors(err));
      setsavingUser(false);
    }
  },[githubUsername,techs,latitude,longitude])

  return (
    <div id='app'>
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor='github_username'>Usuário do Github</label>
            <input 
              id = 'github_username'
              name= 'github_username'
              type = 'text'
              required
              value={githubUsername}
              onChange={(e)=> {
                console.log(e.target.value)
                setGitHubUsername(e.target.value)
              }
              }
            />
          </div>
          <div className="input-block">
            <label htmlFor='techs'>Tecnologias</label>
            <input 
              id = 'techs'
              name= 'techs'
              type = 'text'
              required
              value={techs}
              onChange={(e)=> setTechs(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor='latitude'>Latitude</label>
              <input 
                id = 'latitude'
                name = 'latitude'
                type = 'text'
                required
                value={latitude}
                onChange={(e)=>setLatitude(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor='longitude'>Longitude</label>
              <input 
                id = 'longitude'
                name = 'longitude'
                type = 'text'
                required
                value={longitude}
                onChange={(e)=>setLongitude(e.target.value)}

              />
            </div>
          </div>
          <button
            className={`${savingUser?'inactive':''}`}
            type='submit'
          >
            {savingUser?
              <ReactLoading type='spin' color='#fff' height={'16px'} width={'16px'} />
            :
              'Salvar'
            }
          </button>
        </form>
      </aside>
      <main>
        <ul>
         {
          users.map(user=>
            <li key={user._id} className='dev-item'>
              <header>
                <img src={user.avatar_url} alt={user.name}/>
                <div className="user-info">
                  <strong>{user.name}</strong>
                  <span>{user.techs.join(', ')}</span>
                </div>
              </header>
              <p>{user.bio}</p>
              <a href = {`https://github.com/${user.github_username}`} target="_blank" rel="noopener noreferrer"> Acessar perfil no github</a>
            </li>
          ) 
         }
          
        </ul>
      </main>
    </div>
  );

}

export default App;
