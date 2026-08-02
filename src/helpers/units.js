// Temperatures are stored internally in Celsius (the raw value Open-Meteo
// returns) and converted for display only -- this keeps the toggle instant
// with no extra network request.

export function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

export function displayTemperature(celsius, unit) {
  return unit === 'f' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
}
