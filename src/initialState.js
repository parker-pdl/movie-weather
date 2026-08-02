export default {
  showInfo: false,
  dataLoaded: false,
  latitude: 0,
  longitude: 0,
  updating: false,
  lastUpdate: "00:00",
  unit: "c",
  currentCondition: {
    location: "--",
    temperature: 0,
    feelsLike: 0,
    date: "--",
    weather: "Clear",
    icon: "svg/day/113.png",
    humidity: 0,
    windSpeed: 0,
    cloudCover: 0,
    uvIndex: 0,
    sunrise: "--:--",
    sunset: "--:--",
  },
  foreCastHourly: [
    {
      time: 0,
      rainProbability: 0,
      temperature: 0,
      icon: "svg/day/119.png"
    },
    {
      time: 0,
      rainProbability: 0,
      temperature: 0,
      icon: "svg/day/119.png"
    },
    {
      time: 0,
      rainProbability: 0,
      temperature: 0,
      icon: "svg/day/119.png"
    },
    {
      time: 0,
      rainProbability: 0,
      temperature: 0,
      icon: "svg/night/113.png"
    },
    {
      time: 0,
      rainProbability: 0,
      temperature: 0,
      icon: "svg/night/113.png"
    }
  ],
  foreCastDaily: [
    {
      weekDay: "mon",
      rainProbability: 0,
      icon: "svg/day/113.png",
      temperature: {
        max: 0,
        min: 0
      }
    },
    {
      weekDay: "tue",
      rainProbability: 0,
      icon: "svg/day/113.png",
      temperature: {
        max: 0,
        min: 0
      }
    },
    {
      weekDay: "wed",
      rainProbability: 0,
      icon: "svg/day/119.png",
      temperature: {
        max: 0,
        min: 0
      }
    },
    {
      weekDay: "thu",
      rainProbability: 0,
      icon: "svg/day/122.png",
      temperature: {
        max: 0,
        min: 0
      }
    },
    {
      weekDay: "fri",
      rainProbability: 0,
      icon: "svg/day/122.png",
      temperature: {
        max: 0,
        min: 0
      }
    }
  ]
}
