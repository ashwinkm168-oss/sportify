function TurfCard({ turf }) {
  return (
    <div className="border rounded shadow p-4 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2">{turf.name}</h2>
      <p><strong>Location:</strong> {turf.location}</p>
      <p><strong>Size:</strong> {turf.size}</p>
      <p><strong>Price:</strong> ₹{turf.price}/hr</p>
      <p className="mb-2">{turf.description}</p>
      
      {/* Show first image if exists */}
      {turf.images?.length > 0 && (
        <img
          src={`http://localhost:5000/uploads/${turf.images[0]}`}
          alt="Turf"
          className="rounded w-full mt-2"
        />
      )}
    </div>
  );
}

export default TurfCard;
