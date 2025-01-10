import { useState } from "react";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  function validateForm() {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    };
    let isValid = true;

    // Validate First Name
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required.";
      isValid = false;
    } else if (firstName.length > 50) {
      newErrors.firstName = "First Name cannot exceed 50 characters.";
      isValid = false;
    }

    // Validate Last Name
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required.";
      isValid = false;
    } else if (lastName.length > 50) {
      newErrors.lastName = "Last Name cannot exceed 50 characters.";
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    } else if (email.length > 100) {
      newErrors.email = "Email cannot exceed 100 characters.";
      isValid = false;
    }

    // Validate Subject
    if (!subject.trim()) {
      newErrors.subject = "Subject is required.";
      isValid = false;
    } else if (subject.length > 100) {
      newErrors.subject = "Subject cannot exceed 100 characters.";
      isValid = false;
    }

    // Validate Message
    if (!message.trim()) {
      newErrors.message = "Message is required.";
      isValid = false;
    } else if (message.length > 500) {
      newErrors.message = "Message cannot exceed 500 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return; // Validate the form before submitting

    const formData = {
      firstName,
      lastName,
      email,
      subject,
      message,
    };

    fetch("http://localhost:3000/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Email sent successfully!");
          setFirstName("");
          setLastName("");
          setEmail("");
          setSubject("");
          setMessage("");
          setErrors({
            firstName: "",
            lastName: "",
            email: "",
            subject: "",
            message: "",
          });
        } else {
          response.json().then((data) => {
            alert(data.message || "Failed to send email.");
          });
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Error sending email.");
      });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-gray-100 p-8 rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-ktp-appblue mb-4">
          Contact Us
        </h1>
        <p className="text-gray-700 text-base leading-relaxed mb-6">
          We’re here to answer your questions and value your feedback—don’t
          hesitate to reach out to us!
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="first-name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ktp-appblue focus:border-ktp-appblue sm:text-sm"
                value={firstName}
                maxLength={50}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last-name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ktp-appblue focus:border-ktp-appblue sm:text-sm"
                value={lastName}
                maxLength={50}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ktp-appblue focus:border-ktp-appblue sm:text-sm"
              value={email}
              maxLength={100}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ktp-appblue focus:border-ktp-appblue sm:text-sm"
              value={subject}
              maxLength={100}
              onChange={(e) => setSubject(e.target.value)}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ktp-appblue focus:border-ktp-appblue sm:text-sm"
              value={message}
              maxLength={500}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>

          <div className="flex justify-center">
          <button 
            type='submit'
            className="w-full bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded hover:bg-ktp-appblue hover:text-white transition duration-300 relative group">
              Submit <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&#8250;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;