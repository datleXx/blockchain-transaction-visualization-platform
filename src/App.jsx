import About from './components/pages/About/About'
import Navbar from './components/pages/Welcome/Navbar'
import Runningtext from './components/pages/Welcome/Runningtext'
import {Route, Routes} from "react-router-dom"
import Footer from './Footer'
import MainPage from './components/pages/Main/MainPage'
import NodeContext from './components/pages/Main/NodeContext'
import { useState } from 'react'
import TransactionTable from './components/pages/Transaction/TransactionTable'

function App() {

  const [address,setAddress] = useState(undefined)

  return (
    <>
    <NodeContext.Provider value = {{address, setAddress}}> 
        <Navbar/>       
        <div className='w-screen'>
          <Routes>
            <Route path= "/" element={<Runningtext/>}/>
            <Route path= "/about" element={<About/>}/>
            <Route path = "/mainpage" element={<MainPage/>}/>
            <Route path = "/transactionpage" element={<TransactionTable/>}/>
          </Routes>
        </div>
        <Footer/>
      </NodeContext.Provider>
    </>
  )
}

export default App