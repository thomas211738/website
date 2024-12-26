// src/pages/Rush.tsx

function Rush() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Rush KTP</h1>
      <p className="text-gray-700 leading-relaxed">
        Interested in becoming a member? Our Rush events are the perfect way to
        learn about our fraternity, meet current brothers, and see if KTP is the
        right fit for you. 
      </p>
      <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-2">Upcoming Rush Events</h2>
        <ul className="list-disc list-inside ml-4 text-gray-700">
          <li>Info Night – January 10th at 7PM</li>
          <li>Meet & Greet – January 12th at 6PM</li>
          <li>Interview Rounds – January 14th & 15th</li>
        </ul>
        <p className="text-gray-600 mt-2 text-sm">
          *Dates are subject to change. Follow our social media for the latest
          updates.
        </p>
      </div>
    </div>
  );
}

export default Rush;
