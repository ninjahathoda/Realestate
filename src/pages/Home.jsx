import PropertyCard from "../components/PropertyCard";

const dummyData = [
  { id: 1, image: "https://via.placeholder.com/300", title: "2BHK Flat", location: "Delhi", price: "12,000" },
  { id: 2, image: "https://via.placeholder.com/300", title: "1BHK Studio", location: "Mumbai", price: "15,000" },
];

const Home = () => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {dummyData.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
};

export default Home;
