const shipments = [
  {
    id: "SHP001",
    name: "Medical Supplies - Batch A",
    origin: { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
    destination: { city: "Chennai", lat: 13.0827, lng: 80.2707 },
    currentLocation: { lat: 16.5, lng: 77.0 },
    status: "in_transit",
    riskScore: 72,
    cargo: "Medicine, Vaccines",
    estimatedArrival: "2026-04-20 14:00",
    delay: 2.5,
    affectedNodes: ["SHP003", "SHP005", "SHP007"]
  },
  {
    id: "SHP002",
    name: "Food Ration Kit - Batch B",
    origin: { city: "Delhi", lat: 28.6139, lng: 77.2090 },
    destination: { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
    currentLocation: { lat: 25.0, lng: 83.0 },
    status: "delayed",
    riskScore: 88,
    cargo: "Rice, Wheat, Dal",
    estimatedArrival: "2026-04-19 10:00",
    delay: 6.0,
    affectedNodes: ["SHP004", "SHP006"]
  },
  {
    id: "SHP003",
    name: "Emergency Water Supply",
    origin: { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
    destination: { city: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
    currentLocation: { lat: 17.5, lng: 81.0 },
    status: "in_transit",
    riskScore: 45,
    cargo: "Water Bottles, Purifiers",
    estimatedArrival: "2026-04-19 18:00",
    delay: 0,
    affectedNodes: ["SHP008"]
  },
  {
    id: "SHP004",
    name: "Rescue Equipment",
    origin: { city: "Bangalore", lat: 12.9716, lng: 77.5946 },
    destination: { city: "Coimbatore", lat: 11.0168, lng: 76.9558 },
    currentLocation: { lat: 12.0, lng: 77.3 },
    status: "on_time",
    riskScore: 20,
    cargo: "Tents, Ropes, First Aid",
    estimatedArrival: "2026-04-20 08:00",
    delay: 0,
    affectedNodes: []
  },
  {
    id: "SHP005",
    name: "Generator & Power Units",
    origin: { city: "Pune", lat: 18.5204, lng: 73.8567 },
    destination: { city: "Nagpur", lat: 21.1458, lng: 79.0882 },
    currentLocation: { lat: 19.5, lng: 76.5 },
    status: "delayed",
    riskScore: 91,
    cargo: "Generators, Fuel",
    estimatedArrival: "2026-04-18 22:00",
    delay: 8.0,
    affectedNodes: ["SHP002", "SHP006", "SHP009"]
  },
  {
    id: "SHP006",
    name: "Clothing & Shelter Kits",
    origin: { city: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
    destination: { city: "Surat", lat: 21.1702, lng: 72.8311 },
    currentLocation: { lat: 22.1, lng: 72.6 },
    status: "on_time",
    riskScore: 15,
    cargo: "Blankets, Clothes, Tarpaulin",
    estimatedArrival: "2026-04-19 06:00",
    delay: 0,
    affectedNodes: []
  },
  {
    id: "SHP007",
    name: "Medical Equipment Batch C",
    origin: { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
    destination: { city: "Lucknow", lat: 26.8467, lng: 80.9462 },
    currentLocation: { lat: 26.9, lng: 78.5 },
    status: "in_transit",
    riskScore: 55,
    cargo: "X-Ray Machines, ICU Equipment",
    estimatedArrival: "2026-04-20 12:00",
    delay: 1.5,
    affectedNodes: ["SHP001"]
  },
  {
    id: "SHP008",
    name: "Food Relief - Batch D",
    origin: { city: "Bhopal", lat: 23.2599, lng: 77.4126 },
    destination: { city: "Indore", lat: 22.7196, lng: 75.8577 },
    currentLocation: { lat: 22.9, lng: 76.5 },
    status: "on_time",
    riskScore: 10,
    cargo: "Ready-to-eat Meals",
    estimatedArrival: "2026-04-19 09:00",
    delay: 0,
    affectedNodes: []
  },
  {
    id: "SHP009",
    name: "Communication Equipment",
    origin: { city: "Chennai", lat: 13.0827, lng: 80.2707 },
    destination: { city: "Madurai", lat: 9.9252, lng: 78.1198 },
    currentLocation: { lat: 11.5, lng: 79.5 },
    status: "in_transit",
    riskScore: 38,
    cargo: "Radios, Satellite Phones",
    estimatedArrival: "2026-04-19 16:00",
    delay: 0.5,
    affectedNodes: []
  }
];

const disruptions = [
  {
    id: "DIS001",
    type: "weather",
    severity: "high",
    location: "Andhra Pradesh Coast",
    description: "Cyclone warning issued - wind speeds 120 km/h expected",
    affectedShipments: ["SHP001", "SHP003"],
    detectedAt: "2026-04-18 06:30",
    predictedAt: "2026-04-17 22:00",
    status: "active"
  },
  {
    id: "DIS002",
    type: "traffic",
    severity: "medium",
    location: "NH-44 near Hyderabad",
    description: "Major accident blocking 3 lanes, 6-hour clearance expected",
    affectedShipments: ["SHP002", "SHP005"],
    detectedAt: "2026-04-18 08:15",
    predictedAt: "2026-04-18 07:45",
    status: "active"
  },
  {
    id: "DIS003",
    type: "operational",
    severity: "low",
    location: "Mumbai Port",
    description: "Labor strike causing loading delays of 3-4 hours",
    affectedShipments: ["SHP007"],
    detectedAt: "2026-04-18 09:00",
    predictedAt: "2026-04-18 08:30",
    status: "resolved"
  },
  {
    id: "DIS004",
    type: "weather",
    severity: "critical",
    location: "Bihar-Jharkhand border",
    description: "Flash floods - roads completely submerged",
    affectedShipments: ["SHP002", "SHP004", "SHP006"],
    detectedAt: "2026-04-18 05:00",
    predictedAt: "2026-04-17 18:00",
    status: "active"
  }
];

const nodes = [
  { id: "N1", label: "Mumbai Port", type: "depot", lat: 19.0760, lng: 72.8777 },
  { id: "N2", label: "Delhi Warehouse", type: "depot", lat: 28.6139, lng: 77.2090 },
  { id: "N3", label: "Hyderabad Hub", type: "hub", lat: 17.3850, lng: 78.4867 },
  { id: "N4", label: "Chennai Hospital", type: "destination", lat: 13.0827, lng: 80.2707 },
  { id: "N5", label: "Kolkata NGO", type: "destination", lat: 22.5726, lng: 88.3639 },
  { id: "N6", label: "Vizag Relief Camp", type: "destination", lat: 17.6868, lng: 83.2185 },
  { id: "N7", label: "Bangalore Hub", type: "hub", lat: 12.9716, lng: 77.5946 },
  { id: "N8", label: "Coimbatore Camp", type: "destination", lat: 11.0168, lng: 76.9558 }
];

let updateIndex = 0;
const generateRandomUpdate = () => {
  updateIndex++;
  const shipment = shipments[Math.floor(Math.random() * shipments.length)];
  const riskChange = (Math.random() - 0.5) * 10;
  shipment.riskScore = Math.max(0, Math.min(100, shipment.riskScore + riskChange));
  shipment.currentLocation.lat += (Math.random() - 0.5) * 0.1;
  shipment.currentLocation.lng += (Math.random() - 0.5) * 0.1;
  
  return {
    type: "shipment_update",
    shipment: { ...shipment },
    timestamp: new Date().toISOString()
  };
};

module.exports = { shipments, disruptions, nodes, generateRandomUpdate };
