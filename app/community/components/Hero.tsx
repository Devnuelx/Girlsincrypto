import All from "../../../public/girls.svg"


const Hero = () => (
  <section
    className="relative h-[60vh] flex items-center justify-center bg-cover bg-top bg-[url('/the-girls.svg')]"
  >
    <div className="bg-black bg-opacity-50 absolute inset-0" />
    <h1 className="z-10 text-white text-4xl md:text-6xl font-space text-center">
     COMMUNITY IS EVERYTHING! <br/> WELCOME TO THE<span className="italic text-pink-500"> Best</span> 
    </h1>
  </section>
);

export default Hero;
