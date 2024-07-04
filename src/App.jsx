import React, {useState} from 'react'
import Main from './components/Main'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import { useEffect } from 'react'

function App() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
    const [showModal, setShowModal] =  useState(false)

    function handleToggleModal() {
        setShowModal(!showModal)
    }

    useEffect(() => {
        async function fetchAPIData() {
            const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}`

            const today = (new Date()).toDateString()
            const localKey = `NASA-${today}`
            if (localStorage.getItem(localKey)) {
                const apiData = JSON.parse(localStorage.getItem(localKey))
                setData(apiData)
                console.log('Fetched from local storage cache today!');
                return
            }
            localStorage.clear()

            try {
                const response = await fetch(url)
                const apiData = await response.json()
                localStorage.setItem(localKey, JSON.stringify(apiData))
                setData(apiData)
                console.log('Fetched from API! today');
            } catch (err) {
                console.error(err.mesage)
            }
        }
        fetchAPIData()
    }, [])

  return (
    <>
        {data ? (<Main data={data}/>): (
            <div className='loadingState'>
                <i className="fa-solid fa-gear"></i>
            </div>
        )}
        {showModal && (
            <SideBar data={data} handleToggleModal={handleToggleModal}/>
        )}
        {data && <Footer data={data} handleToggleModal={handleToggleModal}/>}
    </>
  )
}

export default App
