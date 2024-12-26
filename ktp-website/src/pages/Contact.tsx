// src/pages/Contact.tsx

function Contact() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 leading-relaxed">
        Have questions or want to learn more about KTP? We’d love to hear from
        you. Please reach out to us via any of the methods below:
      </p>

      <div className="mt-4 space-y-4">
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> 
          <a
            href="mailto:contact@ktp.org"
            className="text-blue-600 hover:underline ml-1"
          >
            contact@ktp.org
          </a>
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span> (123) 456-7890
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Address:</span> 1234 KTP Lane, 
          College Town, USA
        </p>
      </div>

      <p className="text-gray-700 mt-4">
        We also encourage you to follow us on 
        <a
          href="https://instagram.com/ktp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:underline mx-1"
        >
          Instagram
        </a>
        and
        <a
          href="https://twitter.com/ktp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mx-1"
        >
          Twitter
        </a>
        to stay up to date on our latest events.
      </p>
    </div>
  );
}

export default Contact;
