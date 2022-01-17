import { FormEvent, useEffect, useState } from 'react'
import { FiMoon, FiCheck } from 'react-icons/fi'
import { IoAddCircleOutline } from 'react-icons/io5'
import { BiSun } from 'react-icons/bi'

import { Input } from '../../components/Input'

import './styles.scss'

type TableData = Array<{
  task: string;
  expirationDate: string;
  timestamp: number;
}>

export function Home() {

  const [isDark, setIsDark] = useState(false);

  const [task, setTask] = useState('');
  const [expirationDate, setExpirationDate] = useState('');

  const [tableData, setTableData] = useState<TableData>([])

  useEffect(()=> {
    getTheme()
  }, [])

  function removeOverdueTasks() {
    const todaysDateInMilliseconds = new Date().setHours(0, 0, 0, 0)

    setTableData(tableData.filter(({timestamp})=> timestamp < todaysDateInMilliseconds))
  }

  function getTheme() {
    console.log(JSON.parse(localStorage.getItem('@isDark') || '{"isDark": false}'))
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
    <div className={`homePage ${isDark ? 'isDark' : ''}`}>
      <header className={isDark ? 'isDark' : ''}>
        <h1 className={isDark ? 'isDark' : ''}>To do List</h1>
        <button onClick={() => changeTheme(!isDark)} className={`switcher ${isDark ? 'isDark' : ''}`} aria-label='Trocar tema de cor do site'>
          <div className={isDark ? 'isDark' : ''}>
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
          <Input 
            onChange={event => setTask(event.target.value)} 
            value={task}
            type="text" 
            placeholder="Tarefa..."
          />
          <Input 
            onChange={event => setExpirationDate(event.target.value)}
            value={expirationDate}
            type="date" 
            aria-placeholder="Coloque uma data limite para sua tarefa."
          />
          <button type="submit">
            <IoAddCircleOutline color="var(--text-color)" size={25}/>
            Adicionar
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th scope='col'>Título</th>
              <th scope='col'>Data de expiração</th>
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
                      Concluído
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
    </div>
  )
}