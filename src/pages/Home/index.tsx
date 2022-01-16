import { FiMoon, FiCheck } from 'react-icons/fi'
import { IoAddCircleOutline } from 'react-icons/io5'

import { Input } from '../../components/Input'

import './styles.scss'

export function Home() {
  return(
    <div className="homePage">
      <header>
        <h1>To do List</h1>
        <button className="switcher" aria-label='Trocar tema de cor do site'>
          <div>
            <FiMoon color="var(--yellow)" size={18}/>
          </div>
        </button>
      </header>

      <main>
        <form>
          <Input type="text" placeholder="Tarefa..."/>
          <Input type="date" aria-placeholder="Coloque uma data limite para sua tarefa."/>
          <button type="submit">
            <IoAddCircleOutline color="var(--text-color)"/>
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
            <tr>
              <td>Comprar água</td>
              <td>15/01/2022</td>
              <td>
                <button>
                  <FiCheck color="var(--green)"/>
                  Concluído
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  )
}