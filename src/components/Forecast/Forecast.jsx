import { useCallback, useEffect, useState } from 'react';
import {
  getPrecipitationCategoryMeaning,
  getWeatherSymbol,
} from '../../utils/forecastDataConverter';
import style from './Forecast.module.scss';

const Forecast = () => {
  const [forecast, setForecast] = useState({});
  const [lat, setLat] = useState('59.416929');
  const [lon, setLon] = useState('17.864399');
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchWeatherForecast = useCallback(async () => {
    try {
      const result = await fetch(
        `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`
      );
      const data = await result.json();
      return data;
    } catch (error) {
      setErrorMessage(new Error(error));
      throw error;
    }
  }, [lat, lon]);

  const handleSearch = () => {
    if (lat && lon) {
      fetchWeatherForecast();
    }
  };

  const handleLatInput = (event) => {
    const input = event.target.value;
    setLat(input.toString());
  };

  const handleLonInput = (event) => {
    const input = event.target.value;
    setLon(input.toString());
  };

  const setWeatherForecast = useCallback(async () => {
    const forecast = await fetchWeatherForecast();
    setForecast(forecast);
  }, [fetchWeatherForecast]);

  useEffect(() => {
    setWeatherForecast();
  }, [setWeatherForecast]);

  const { approvedTime, referenceTime, timeSeries } = forecast;

  return (
    <div className={style.container}>
      <div className={style.searchBar}>
        <div className={style.inputField}>
          <label for="lat">Latitude:</label>
          <input
            placeholder="Latitude"
            onChange={(e) => handleLatInput(e)}
            value={lat}
            id="lat"
          />
        </div>
        <div className={style.inputField}>
          <label for="lon">Longitude:</label>
          <input
            placeholder="Longitude"
            onChange={(e) => handleLonInput(e)}
            value={lon}
            id="lon"
          />
        </div>

        <button onClick={() => handleSearch()}>Sök</button>
        {errorMessage && <span>Felmeddelande: {errorMessage.message}</span>}
      </div>

      <div className={style.header}>
        <span></span>
        <span>{`Approvedtime: ${approvedTime}`}</span>
        <span>{`ReferenceTime: ${referenceTime}`}</span>
      </div>

      <ul>
        {timeSeries?.map((time) => {
          return (
            <li key={time.validTime}>
              <span>Time: {time.validTime}</span>
              <span>
                {`Air temperature:
                ${
                  time.parameters.find((parameter) => parameter.name === 't')
                    .values[0]
                } C`}
              </span>
              <span>
                {`Precipitation:
                ${getPrecipitationCategoryMeaning(
                  time.parameters.find((parameter) => parameter.name === 'pcat')
                    .values[0]
                )}`}
              </span>
              <span>
                {`Median precipitation intensity:
                ${
                  time.parameters.find(
                    (parameter) => parameter.name === 'pmedian'
                  ).values[0]
                } mm`}
              </span>
              <span>
                {`Weather Symbol:
                ${getWeatherSymbol(
                  time.parameters.find(
                    (parameter) => parameter.name === 'Wsymb2'
                  ).values[0]
                )}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Forecast;
