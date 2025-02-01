import {useEffect} from 'react';
import { useDrawerContext } from '../shared/contexts';
import {Routes,Route,Navigate} from 'react-router-dom';
import { DetalheDeCidades } from '../pages/cidades/DetalheDeCidades';
import { ListagemDeCidades } from '../pages/cidades/ListagemDeCidades';
import { Dashboard, ListagemDePessoas, DetalheDePessoas } from '../pages';

export const AppRoutes = () => {
  const {setDrawerOptions} = useDrawerContext()

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        label: 'Página inicial',
        path: '/pagina-inicial'
      },
      {
        icon: 'location_city',
        label: 'Cidades',
        path: '/cidades'
      },
      {
        icon: 'people',
        label: 'Pessoas',
        path: '/pessoas'
      },
    ])
  }, [setDrawerOptions])

  return (
      <Routes>
        <Route path='/pagina-inicial' element={<Dashboard/>}/>

        <Route path='/pessoas' element={<ListagemDePessoas/>}/>
        <Route path='/pessoas/detalhe/:id' element={<DetalheDePessoas/>}/>

        <Route path='/cidades' element={<ListagemDeCidades/>}/>
        <Route path='/cidades/detalhe/:id' element={<DetalheDeCidades/>}/>

        <Route path='*' element={<Navigate to="/pagina-inicial" replace/>}/>
      </Routes>
  )
}