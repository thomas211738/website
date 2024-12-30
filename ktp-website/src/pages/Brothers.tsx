// src/pages/Brothers.tsx

function Brothers() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Meet the Brothers</h1>
      <p className="text-gray-700 leading-relaxed">
        Our fraternity is made up of diverse individuals from various
        backgrounds and disciplines. Each brother brings their own unique
        perspective and talents to our community.
      </p>
      <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700">
        <li>Brother 1 – Chapter President</li>
        <li>Brother 2 – Vice President</li>
        <li>Brother 3 – Social Chair</li>
        <li>Brother 4 – Recruitment Leader</li>
        <li>Brother 5 – Community Outreach</li>
      </ul>
      <p className="text-gray-700 mt-4">
        We pride ourselves on our strong bond and the support we provide to each
        other, both academically and socially.
      </p>
    </div>
  );
}

export default Brothers;
