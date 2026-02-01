import Image from "next/image";

const cities = ["Singapore", "United Arab Emirate", "South Africa", "Nigeria"];

const Meetups = () => (
  <section className="text-center py-12 px-4">
    <h2 className="text-3xl font-serif italic text-pink-500">#meetups</h2>
    <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm font-medium uppercase tracking-widest text-gray-700">
      {cities.map((city) => (
        <span key={city}>{city}</span>
      ))}
    </div>
    <div className="w-full max-w-sm mx-auto mt-8 h-[30vh]">

        <h3 className=" font-space text-3xl">Coming Soon...</h3>
      {/* <Image
        src="/meetup-group.jpg"
        alt="Meetup"
        width={400}
        height={300}
        className="rounded-lg"
      /> */}
    </div>
  </section>
);

export default Meetups;
