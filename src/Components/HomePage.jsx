import React from 'react'
import './HomePage.css'
const HomePage = () => {
  return (
    <div className="Home-conatainer">
        <div className="Home-header">  {/*website ka headder */}
            <div></div> {/* this is For websiet Logo */}
            <div></div> {/* This is For website name */}
            <div></div> {/* Anything kr dena like about ,, contact etc  , menu etc  */}
        </div>

      <div id="Main">
          <div id="main-left">idhar side kuchh likh dena Acha sa discription 10-15 words ka (colorfull)</div>
          <div id="main-right">idhar side 2 div with button ek user ek authourity Login</div>
      </div>


    <div id="footer">
      isme github  , contact , etc daal dena ,, copyright wala symbol bhi

    </div>
    </div>
  )
}

export default HomePage