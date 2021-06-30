import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Chart from '../components/chart'

export default function Home({data, rateData}) {
  return (
    <div className={styles.container}>
      <Chart data={data} rateData={rateData}/>
    </div>
  )
}

export async function getServerSideProps() {
  const dataUrl = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=cumPeopleVaccinatedFirstDoseByPublishDate&metric=hospitalCases&metric=newCasesByPublishDate&metric=newDeaths28DaysByDeathDate&metric=cumPeopleVaccinatedSecondDoseByPublishDate&format=json'
  const dataUrlEng = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=cumPeopleVaccinatedFirstDoseByPublishDate&metric=hospitalCases&metric=newCasesByPublishDate&metric=newDeaths28DaysByDeathDate&metric=cumPeopleVaccinatedSecondDoseByPublishDate&format=json'
  const res = await fetch(dataUrl)
  const data = await res.json()

  const rateDataUrlEng = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=nation&areaCode=E92000001&metric=newCasesByPublishDateRollingRate&metric=newCasesBySpecimenDateRollingRate&metric=newDeaths28DaysByDeathDateRollingRate&format=json'
  const rateDataUrl = 'https://api.coronavirus.data.gov.uk/v2/data?areaType=overview&metric=newCasesByPublishDateRollingRate&metric=newCasesBySpecimenDateRollingRate&metric=newDeaths28DaysByDeathDateRollingRate&format=json'
  const rateRes = await fetch(rateDataUrl)
  const rateData = await rateRes.json()
  return {props: {data: data.body, rateData: rateData.body}}
}