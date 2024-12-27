// src/components/Footer.tsx

function Footer() {
  return (
    <footer className="bg-gray-100 py-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-gray-700">Follow us on social media:</p>
        <ul className="flex justify-center space-x-4 mt-2">
          <li>
            <a
              href="https://instagram.com/ktpbostonu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://facebook.com/ktpbostonu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/kappa-theta-pi-lambda-chapter/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
