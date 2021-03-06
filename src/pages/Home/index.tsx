import { FormEvent, useEffect, useState } from 'react'

import { FiMoon, FiCheck } from 'react-icons/fi'
import { IoAddCircleOutline } from 'react-icons/io5'
import { BiSun } from 'react-icons/bi'

import { Input } from '../../components/Input'

import cn from 'classnames'

import './styles.scss'

type TableData = Array<{
  task: string;
  expirationDate: string;
  timestamp: number;
}>

export function Home() {

  const [isDark, setIsDark] = useState(false);
  const [themeTransitionReleased, setThemeTransitionRelease] = useState(false);

  const [task, setTask] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const [tableData, setTableData] = useState<TableData>([])

  const themesClassObj = {'isDark': isDark, 'themeTransition': themeTransitionReleased};

  useEffect(()=> {  
    setIsDark(getTheme())
    setTableData(getTableData())
    removeOverdueTasks()
    releaseThemeTransition()
  }, [])

  useEffect(()=> {
    saveTableData()
  }, [tableData])

  function releaseThemeTransition() {
    setTimeout(()=> {
      setThemeTransitionRelease(true)
    }, 400)
  }

  function removeOverdueTasks() {
    const todaysDateInMilliseconds = new Date().setHours(0, 0, 0, 0)

    setTableData(getTableData().filter(({timestamp})=> timestamp >= todaysDateInMilliseconds ))  
  } 

  function saveTableData() {
    localStorage.setItem('@tableData', JSON.stringify(tableData))
  }

  function getTableData(): TableData {
    const tableData = JSON.parse(localStorage.getItem('@tableData') || '[]')

    return tableData
  }

  function getTheme() {
    const { isDark } = JSON.parse(localStorage.getItem('@isDark') || '{"isDark": false}')

    return isDark
  }

  function changeTheme(isDark: boolean) {
    setIsDark(isDark);

    localStorage.setItem('@isDark', JSON.stringify({ isDark }));
  }

  function addTaskToTable(event: FormEvent) {
    event.preventDefault();

    const formattedTask = task.trim()
    
    if(formattedTask === '') return alert('Preencha todos os campos.')
    if(expirationDate === '') return alert('Preencha todos os campos.')

    const todaysDateInMilliseconds = new Date().setHours(0, 0, 0, 0)
    const expirationDateInMilliseconds = new Date(expirationDate).setHours(24)

    if(expirationDateInMilliseconds < todaysDateInMilliseconds) return alert('Coloque uma data correta.')

    const formattedExpirationDate = expirationDate.split('-').reverse().join('/')

    const values = {
      task: formattedTask,
      expirationDate: formattedExpirationDate,
      timestamp: expirationDateInMilliseconds
    }

    setTableData([...tableData, values])

    setExpirationDate('')
    setTask('')
  }

  function markTaskAsCompleted(taskIndex: number) {
    setTableData(tableData.filter((_, i)=> i !== taskIndex))
  }

  return(
    <div className={cn('homePage', themesClassObj)}>
      <header className={cn(themesClassObj)}>
        <h1 className={cn(themesClassObj)}>To do List</h1>
        <button 
          onClick={() => changeTheme(!isDark)} 
          className={cn('switcher', themesClassObj)} 
          aria-label='Trocar tema de cor do site'
        >
          <div className={cn(themesClassObj)}>
            {isDark ? 
              <BiSun color="var(--yellow)" size={19} />
              :
              <FiMoon color="var(--yellow)" size={18}/>
            }
          </div>
        </button>
      </header>

      <main>
        <form onSubmit={addTaskToTable}>
          <div className="inputGroup">
            <label htmlFor="task" className={cn(themesClassObj)}>Tarefa:</label>
            <Input
              onChange={event => setTask(event.target.value)}
              value={task}
              type="text"
              placeholder="Tarefa..."
              id='task'
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="expirationDate" className={cn(themesClassObj)}>Data de expira????o:</label>
            <Input
              onChange={event => setExpirationDate(event.target.value)}
              value={expirationDate}
              type="date"
              id='expirationDate'
            />
          </div>
          <button type="submit">
            <IoAddCircleOutline color="var(--text-color)" size={25}/>
            Adicionar
          </button>
        </form>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th scope='col'>T??tulo</th>
                <th scope='col'>Data de expira????o</th>
                <th scope='col'></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(({task, expirationDate}, i) => {
                return (
                  <tr key={i}>
                    <td className="task" title={task}>{task}</td>
                    <td>{expirationDate}</td>
                    <td>
                      <button onClick={()=> markTaskAsCompleted(i)}>
                        <FiCheck color="var(--green)" size="20"/>
                        Conclu??do
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}