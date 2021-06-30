import React from 'react';
import {Line} from 'react-chartjs-2';

const HOSPITAL_COLOR = "blue"
const TWO_JAB_COLOR = "lightgreen"
const ONE_JAB_COLOR = "darkgreen"
const DEATHS_COLOR = "red"
const CASES_COLOR = "pink"

const getItem = (color, data, label) => ({
  label,
  data: data.reverse(),
  fill: false,
  lineTension: 0.1,
  backgroundColor: color,
  borderColor: color,
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: color,
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: color,
  pointHoverBorderColor: color,
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  borderColor: color,
})
function mapRateData(data) {
  const deaths = []
  const cases = []
  const labels = []
  let previousOneJab = 0
  let previousTwoJab = 0
  data.forEach(item => {
    labels.push(item.date)
    cases.push(item.newCasesByPublishDateRollingRate)
    deaths.push(item.newDeaths28DaysByDeathDateRollingRate)
  })

  return {
    labels: labels.reverse(),
    datasets: [
      getItem(DEATHS_COLOR, deaths, "Deaths"),
      getItem(CASES_COLOR, cases, "New Cases"),
    ]
  }
}
function mapData(data) {
  const oneJab = []
  const twoJab = []
  const deaths = []
  const cases = []
  const labels = []
  const hospital = []
  let previousOneJab = 0
  let previousTwoJab = 0
  data.forEach(item => {
    if(item.cumPeopleVaccinatedFirstDoseByPublishDate) {
      oneJab.push(item.cumPeopleVaccinatedFirstDoseByPublishDate / 1000)
      previousOneJab = item.cumPeopleVaccinatedFirstDoseByPublishDate / 1000
    } else if(previousOneJab) {
      oneJab.push(previousOneJab)
    }
    if(item.cumPeopleVaccinatedSecondDoseByPublishDate) {
      twoJab.push(item.cumPeopleVaccinatedSecondDoseByPublishDate / 1000)
      previousTwoJab = item.cumPeopleVaccinatedSecondDoseByPublishDate / 1000
    } else if(previousTwoJab) {
      twoJab.push(previousTwoJab)
    }
    hospital.push(item.hospitalCases)
    labels.push(item.date)
    cases.push(item.newCasesByPublishDate)
    deaths.push(item.newDeaths28DaysByDeathDate)
  })

  return {
    labels: labels.reverse(),
    datasets: [
      getItem(DEATHS_COLOR, deaths, "Deaths"),
      getItem(CASES_COLOR, cases, "New Cases"),
      getItem(HOSPITAL_COLOR, hospital, "Hospitalisations"),
      getItem(ONE_JAB_COLOR, oneJab, "One Jab (thousands)"),
      getItem(TWO_JAB_COLOR, twoJab, "Two Jabs (thousands)"),
    ]
  }
}

const Chart = ({data, rateData}) => {
  return (
    <div style={{width: 1000}}>
      <h1>COVID Counts</h1>
      <p>All data is sourced from <a href="https://coronavirus.data.gov.uk">https://coronavirus.data.gov.uk</a></p>
      <h2>Absolute Numbers</h2>
      <Line
        data={mapData(data)}
        width={1000}
        height={500}
      />
      <h2>Rates <span style={{fontWeight: "normal", fontSize: 15}}>(Per 100,000)</span></h2>
      <Line
        data={mapRateData(rateData)}
        width={1000}
        height={300}
      />
      <h3>Rate calculations</h3>
      <p>Rates are calculated in order to compare areas or population groups of different sizes. All rates currently presented on this website are crude rates expressed per 100,000 population, ie the count (eg cases or deaths) is divided by the denominator population and then multiplied by 100,000, without any adjustment for other factors.</p>
      <p>Populations used are Office for National Statistics 2019 mid-year estimates, except for NHS Regions, for which 2019 estimates are not yet available, so 2018 mid-year estimates are used.</p>
    </div>
  );
}

export default Chart