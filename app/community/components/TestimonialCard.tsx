type Props = {
  name: string;
  message: string;
};

const TestimonialCard = ({ name, message }: Props) => (
  <div className="bg-white p-6 rounded-lg shadow-md my-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
      <p className="font-semibold">{name}</p>
    </div>
    <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
  </div>
);

export default TestimonialCard;
