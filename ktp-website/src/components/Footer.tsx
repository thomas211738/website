// Footer.tsx
import Icons from "./Icons";
import downloadonappstore from "../img/Download on App Store.png";

function Footer() {
  return (
    <footer className="bg-[#134b91] text-white py-12">
      {/*
        Parent container uses Tailwind's responsive grid classes:
        - grid-cols-1 on all screens by default
        - md:grid-cols-3 on screens ≥ 768px
      */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center items-center px-4">
        {/* Menu Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Menu</h3>
          {/*
            For nav items, you can also switch to a stacked approach at small
            breakpoints to avoid horizontal text overlap
          */}
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/rush" className="hover:underline">
                Rush
              </a>
            </li>
            <li>
              <a href="/brothers" className="hover:underline">
                Brothers
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          {/*
            Also use `flex-wrap` if you have more icons, so they can wrap on small screens.
          */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://facebook.com/ktpbostonu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <Icons.Facebook />
            </a>
            <a
              href="https://instagram.com/ktpbostonu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <Icons.Instagram />
            </a>
            <a
              href="https://www.linkedin.com/company/kappa-theta-pi-lambda-chapter/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <Icons.Linkedin />
            </a>
          </div>
        </div>

        {/* App Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Boston Kappa Theta Pi App</h3>
          <div className="flex justify-center">
            <a
              href="https://apps.apple.com/us/app/boston-ktp/id6654894541?platform=iphone"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300"
            >
              <img
                src={downloadonappstore}
                alt="App Store"
                className="h-12 mx-auto"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-sm border-t border-white pt-4 px-4">
        Developed and maintained by Lambda Chapter
      </div>
      <div className="mt-2 text-center text-sm">
        © Kappa Theta Pi 2025. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
