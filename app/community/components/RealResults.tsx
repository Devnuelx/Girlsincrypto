import Image from "next/image";

const RealResults = () => (
  <section className="py-16 bg-[#f9f9f9] font-space">
    <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto px-4">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <Image
          src="/freeguide.jpg"
          alt="Gracen"
          width={400}
          height={400}
          className="rounded-lg"
        />
      </div>
      <div className="md:w-1/2 md:pl-8 text-center md:text-left">
        <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">Real Results</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
          Girls are making money <span className="italic text-pink-500">beyond</span> the industry 9–5 average.
        </h2>
        <p className="mt-4 text-gray-600 text-sm">
          Victoria has been working as a project manager with leaverage and time to trade, invest and enjoy life offer, she&apos;s a bad@$$...<br/>
        </p>

        <span className="text-gray-600 pt-10">More wins coming...</span>
      </div>
    </div>
  </section>
);

export default RealResults;
