document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  const map = L.map("map").setView([20.5937, 78.9629], 5); // Default to India

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Pull the location and title from data attributes
  const location = mapContainer.dataset.location;
  const title = mapContainer.dataset.title;

  if (location) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          map.setView([lat, lon], 13);
          L.marker([lat, lon]).addTo(map)
            .bindPopup(`${title}<br>${location}`).openPopup();
        }
      });
  }
});
