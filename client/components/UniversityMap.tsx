import { useEffect, useRef } from "react";

declare global {
  interface Window {
    L: any;
  }
}

const universities = [
  { name: "Milwaukee School of Engineering", location: "Milwaukee, WI, USA", lat: 43.045, lon: -87.906 },
  { name: "Andrews University", location: "Berrien Springs, Michigan, USA", lat: 41.9475, lon: -86.3597 },
  { name: "North Dakota State University", location: "Fargo, North Dakota, USA", lat: 46.897, lon: -96.802 },
  { name: "The State University of New York", location: "Buffalo, NY, USA", lat: 43.0008, lon: -78.789 },
  { name: "The University of Missouri", location: "Columbia, MO, USA", lat: 38.9456, lon: -92.3295 },
  { name: "Drexel University", location: "Philadelphia, PA, USA", lat: 39.9566, lon: -75.1899 },
  { name: "University of Dayton", location: "Dayton, Ohio, USA", lat: 39.7392, lon: -84.179 },
  { name: "Wright State University", location: "Dayton, Ohio, USA", lat: 39.7793, lon: -84.0646 },
  { name: "Southern Illinois University Carbondale", location: "Carbondale, IL, USA", lat: 37.715, lon: -89.219 },
  { name: "University of Wisconsin-Milwaukee", location: "Milwaukee, WI, USA", lat: 43.0753, lon: -87.8828 },
  { name: "Montana State University", location: "Bozeman, Montana, USA", lat: 45.6689, lon: -111.0466 },
  { name: "University of North Texas", location: "Denton, Texas, USA", lat: 33.2104, lon: -97.1536 },
  { name: "Illinois Institute of Technology", location: "Chicago, IL, USA", lat: 41.8349, lon: -87.627 },
  { name: "University of Illinois Urbana-Champaign", location: "Urbana, IL, USA", lat: 40.102, lon: -88.2272 },
  { name: "St. Cloud State University", location: "St. Cloud, MN, USA", lat: 45.548, lon: -94.149 },
  { name: "The University of South Alabama", location: "Alabama, USA", lat: 30.6954, lon: -88.1106 },
  { name: "Purdue University", location: "West Lafayette, IN, USA", lat: 40.4237, lon: -86.9212 },
  { name: "University of Wisconsin-Madison", location: "Madison, WI, USA", lat: 43.0766, lon: -89.4125 },
  { name: "University of Maryland", location: "College Park, MD, USA", lat: 38.9869, lon: -76.9426 },
  { name: "University of Arizona", location: "Tucson, AZ, USA", lat: 32.2319, lon: -110.9501 },
  { name: "Iowa State University", location: "Ames, Iowa, USA", lat: 42.0267, lon: -93.6465 },
  { name: "University of Nebraska", location: "Lincoln, NE, USA", lat: 40.8202, lon: -96.7005 },
  { name: "Virginia Tech", location: "Blacksburg, VA, USA", lat: 37.2296, lon: -80.4244 },
  { name: "University of Minnesota-Twin Cities", location: "Minneapolis, MN, USA", lat: 44.9727, lon: -93.2354 },
  { name: "Columbia University", location: "New York, NY, USA", lat: 40.8075, lon: -73.9626 },
  { name: "University of Florida", location: "Gainesville, FL, USA", lat: 29.6516, lon: -82.3248 },
  { name: "Vanderbilt University", location: "Nashville, TN, USA", lat: 36.1447, lon: -86.8027 },
  { name: "University of Rochester", location: "Rochester, NY, USA", lat: 43.1286, lon: -77.628 },
  { name: "Case Western Reserve University", location: "Cleveland, OH, USA", lat: 41.5042, lon: -81.6082 },
  { name: "University of California-Berkeley", location: "Berkeley, CA, USA", lat: 37.8719, lon: -122.2585 },
  { name: "University of Southern California", location: "Los Angeles, CA, USA", lat: 34.0224, lon: -118.2851 },
  { name: "Texas A&M University", location: "College Station, TX, USA", lat: 30.6187, lon: -96.3365 },
  { name: "University of Texas at Dallas", location: "Richardson, TX, USA", lat: 32.9858, lon: -96.7501 },
  { name: "Ohio State University", location: "Columbus, OH, USA", lat: 40.0076, lon: -83.0301 },
  { name: "Georgia Tech", location: "Atlanta, GA, USA", lat: 33.7756, lon: -84.3963 },
  { name: "Rutgers University", location: "New Brunswick, NJ, USA", lat: 40.5007, lon: -74.4479 },
  { name: "Wichita State University", location: "Wichita, KS, USA", lat: 37.7193, lon: -97.2934 },
  { name: "Embry-Riddle Aeronautical University", location: "Daytona Beach, FL, USA", lat: 29.1872, lon: -81.0487 },
  { name: "Boston University", location: "Boston, MA, USA", lat: 42.3505, lon: -71.1054 },
  { name: "South Dakota State University", location: "Brookings, SD, USA", lat: 44.3178, lon: -96.7836 },
  { name: "Stony Brook University", location: "Stony Brook, NY, USA", lat: 40.917, lon: -73.126 },
  { name: "Pennsylvania State University", location: "University Park, PA, USA", lat: 40.7982, lon: -77.8599 },
  { name: "California State University, Long Beach", location: "Long Beach, CA, USA", lat: 33.7838, lon: -118.1141 },
  { name: "New York University", location: "New York, NY, USA", lat: 40.7295, lon: -73.9965 },
  { name: "Arizona State University", location: "Tempe, AZ, USA", lat: 33.421999, lon: -111.933 },
  { name: "Cornell University", location: "Ithaca, NY, USA", lat: 42.4534, lon: -76.4735 },
  { name: "Washington State University", location: "Pullman, WA, USA", lat: 46.7302, lon: -117.1627 },
  { name: "University of Washington", location: "Seattle, WA, USA", lat: 47.655, lon: -122.308 },
  { name: "Kettering University", location: "Flint, MI, USA", lat: 43.0156, lon: -83.6932 },
  { name: "Marquette University", location: "Milwaukee, WI, USA", lat: 43.0389, lon: -87.9284 },
  { name: "Brown University", location: "Providence, RI, USA", lat: 41.8268, lon: -71.4025 },
  { name: "University of Colorado Boulder", location: "Boulder, CO, USA", lat: 40.0076, lon: -105.2659 },
  { name: "Colorado State University", location: "Fort Collins, CO, USA", lat: 40.5734, lon: -105.0865 },
  { name: "San Jose State University", location: "San Jose, CA, USA", lat: 37.3352, lon: -121.8811 },
  { name: "University of North Florida", location: "Jacksonville, FL, USA", lat: 30.2729, lon: -81.5084 },
  { name: "San Francisco State University", location: "San Francisco, CA, USA", lat: 37.7219, lon: -122.4782 },
  { name: "Kansas State University", location: "Manhattan, KS, USA", lat: 39.1974, lon: -96.5847 },
  { name: "Deakin University", location: "Melbourne, VIC, Australia", lat: -37.8474, lon: 144.9586 },
  { name: "University of Queensland", location: "Brisbane, QLD, Australia", lat: -27.4975, lon: 153.0137 },
  { name: "University of New South Wales", location: "Sydney, NSW, Australia", lat: -33.917, lon: 151.231 },
  { name: "University of Technology", location: "Sydney, NSW, Australia", lat: -33.883, lon: 151.200 },
  { name: "Queensland University of Technology", location: "Brisbane, QLD, Australia", lat: -27.478, lon: 153.028 },
  { name: "Royal Melbourne Institute of Technology", location: "Melbourne, VIC, Australia", lat: -37.807, lon: 144.963 },
  { name: "Australian National University", location: "Canberra, ACT, Australia", lat: -35.277, lon: 149.118 },
  { name: "University of Sydney", location: "Sydney, NSW, Australia", lat: -33.888, lon: 151.187 },
  { name: "University of Wollongong", location: "Wollongong, NSW, Australia", lat: -34.407, lon: 150.878 },
  { name: "Western Sydney University", location: "Sydney, NSW, Australia", lat: -33.755, lon: 150.690 },
  { name: "University of Adelaide", location: "Adelaide, SA, Australia", lat: -34.920, lon: 138.604 },
  { name: "Macquarie University", location: "Sydney, NSW, Australia", lat: -33.775, lon: 151.118 },
  { name: "Federation University", location: "Ballarat, VIC, Australia", lat: -37.552, lon: 143.818 },
  { name: "Monash University", location: "Clayton, VIC, Australia", lat: -37.911, lon: 145.134 },
  { name: "Curtin University", location: "Bentley, WA, Australia", lat: -32.006, lon: 115.895 },
  { name: "City University London", location: "London, UK", lat: 51.5273, lon: -0.1025 },
  { name: "Lancaster University", location: "Lancaster, UK", lat: 54.005, lon: -2.785 },
  { name: "University of Leicester", location: "Leicester, UK", lat: 52.622, lon: -1.125 },
  { name: "University of Nottingham", location: "Nottingham, UK", lat: 52.938, lon: -1.194 },
  { name: "University of Birmingham", location: "Birmingham, UK", lat: 52.450, lon: -1.930 },
  { name: "Queen Mary University of London", location: "London, UK", lat: 51.523, lon: -0.040 },
  { name: "University of Strathclyde", location: "Glasgow, UK", lat: 55.861, lon: -4.242 },
  { name: "Heriot-Watt University", location: "Edinburgh, UK", lat: 55.910, lon: -3.323 },
  { name: "University of Edinburgh", location: "Edinburgh, UK", lat: 55.944, lon: -3.188 },
  { name: "University of London", location: "London, UK", lat: 51.521, lon: -0.130 },
  { name: "University of Central Lancashire", location: "Preston, UK", lat: 53.763, lon: -2.708 },
  { name: "Manchester Metropolitan University", location: "Manchester, UK", lat: 53.472, lon: -2.240 },
  { name: "Queen's University", location: "Kingston, ON, Canada", lat: 44.225, lon: -76.495 },
  { name: "University of Manitoba", location: "Winnipeg, MB, Canada", lat: 49.809, lon: -97.137 },
  { name: "University of New Brunswick", location: "Fredericton, NB, Canada", lat: 45.947, lon: -66.636 },
  { name: "University of Toronto", location: "Toronto, ON, Canada", lat: 43.6629, lon: -79.3957 },
  { name: "Concordia University", location: "Montreal, QC, Canada", lat: 45.496, lon: -73.578 },
  { name: "Carleton University", location: "Ottawa, ON, Canada", lat: 45.387, lon: -75.696 },
  { name: "University of British Columbia", location: "Vancouver, BC, Canada", lat: 49.260, lon: -123.251 },
  { name: "University College Cork (UCC)", location: "Cork, Ireland", lat: 51.8939, lon: -8.4936 },
  { name: "Trinity College Dublin (TCD)", location: "Dublin, Ireland", lat: 53.343, lon: -6.254 },
  { name: "Ecole Superieure D'ingenieurs De Rouen (ESIGELEC)", location: "Rouen, France", lat: 49.4106, lon: 1.0891 },
  { name: "Leibniz University of Hannover", location: "Hannover, Germany", lat: 52.3834, lon: 9.7386 },
  { name: "University of Twente", location: "Enschede, Netherlands", lat: 52.240, lon: 6.8526 },
  { name: "Groningen University", location: "Groningen, Netherlands", lat: 53.220, lon: 6.570 },
  { name: "Academia Maribor Slovenia", location: "Maribor, Slovenia", lat: 46.5625, lon: 15.6459 },
  { name: "Manipal International University", location: "Negeri Sembilan, Malaysia", lat: 2.8181, lon: 101.7669 },
  { name: "Manipal University Dubai", location: "Dubai, UAE", lat: 25.103, lon: 55.162 },
];

export default function UniversityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Load Leaflet CSS and JS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      if (!window.L || mapInstanceRef.current) return;

      const map = window.L.map(mapRef.current).setView([20, 0], 2);

      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      universities.forEach(u => {
        window.L.marker([u.lat, u.lon]).addTo(map)
          .bindPopup(`<strong>${u.name}</strong><br>${u.location}`);
      });

      mapInstanceRef.current = map;
    };
    document.head.appendChild(script);

    return () => {
      link.remove();
      script.remove();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-border bg-slate-900">
      <div 
        ref={mapRef} 
        className="h-96 w-full"
        style={{ background: '#111' }}
      />
    </div>
  );
}
